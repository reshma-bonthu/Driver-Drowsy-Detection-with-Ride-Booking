import cv2
import numpy as np
import dlib
from imutils import face_utils
import winsound
import threading
from bson.objectid import ObjectId
from pymongo import MongoClient
import sys
import os
import urllib.request
driver_id = sys.argv[1]

conn_string = os.getenv("CONN")  # gets the environment variable CONN
client = MongoClient(conn_string)
db = client["safetyOnWheels"]  # your database name
drivers_collection = db["drivers"]
driversessions_collection = db["driversessions"]

# Initialize the camera
cap = cv2.VideoCapture(0)

# Initialize the face detector and the landmark predictor
detector = dlib.get_frontal_face_detector()
def get_predictor_path():
    file_path = "shape_predictor_68_face_landmarks.dat"
    
    # Check if the file already exists
    if not os.path.exists(file_path):
        print("Downloading shape_predictor_68_face_landmarks.dat...")
        # Your Google Drive direct download link
        url = os.getenv("DAT")
        urllib.request.urlretrieve(url, file_path)
        print("Download completed.")
    
    return file_path

# Now use the path
predictor = dlib.shape_predictor(get_predictor_path())
# Status markers
sleep = 0
drowsy = 0
active = 0
yawn = 0
status = ""
color = (0, 0, 0)

sound_thread_running = False

def play_alert_sound():
    global sound_thread_running
    if not sound_thread_running:
        sound_thread_running = True
        try:
            print("Playing alert sound...")
            winsound.Beep(1000, 2000)
        finally:
            sound_thread_running = False

# Function to compute distance between two points
def compute(ptA, ptB):
    dist = np.linalg.norm(ptA - ptB)
    return dist

# Function to detect blinking
def blinked(a, b, c, d, e, f):
    up = compute(b, d) + compute(c, e)
    down = compute(a, f)
    ratio = up / (2.0 * down)

    if ratio > 0.25:
        return 2  # open
    elif ratio > 0.21 and ratio <= 0.25:
        return 1  # Partial Blink
    else:
        return 0  # sleeping

# Function to detect yawning
def is_yawning(landmarks):
    # Mouth landmarks
    top_lip = landmarks[51]
    bottom_lip = landmarks[57]
    left_corner = landmarks[48]
    right_corner = landmarks[54]

    # Vertical distance (mouth opening)
    vertical_dist = compute(top_lip, bottom_lip)

    # Horizontal distance (mouth width)
    horizontal_dist = compute(left_corner, right_corner)

    # Yawn ratio
    yawn_ratio = vertical_dist / horizontal_dist

    return yawn_ratio > 0.52  # Threshold for detecting yawns

while True:
    _, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = detector(gray)
    face_frame = frame.copy()
    for face in faces:
        x1 = face.left()
        y1 = face.top()
        x2 = face.right()
        y2 = face.bottom()
        cv2.rectangle(face_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        # Get the landmarks
        landmarks = predictor(gray, face)
        landmarks = face_utils.shape_to_np(landmarks)

        # Detect blinking in both eyes
        left_blink = blinked(landmarks[36], landmarks[37], landmarks[38], landmarks[41], landmarks[40], landmarks[39])
        right_blink = blinked(landmarks[42], landmarks[43], landmarks[44], landmarks[47], landmarks[46], landmarks[45])

        # Check yawning
        if is_yawning(landmarks):
            yawn += 1
            if yawn > 5:
                status = "Yawning !!!"
                color = (255, 165, 0)  # Orange for yawning
                cv2.putText(frame, status, (100, 150), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)
                #winsound.Beep(1000, 2000)  # Frequency 1000Hz for 2 seconds
                drivers_collection.update_one(
                    {"_id": ObjectId(driver_id)},
                    {"$inc": {"yawn": 1}}
                )
        else:
            yawn = 0

        # Checking the blink status
        if left_blink == 0 or right_blink == 0:
            sleep += 1
            drowsy = 0
            active = 0
            if sleep > 10:
                status = "SLEEPING !!!"
                color = (255, 0, 0)  # Red for sleeping
                cv2.putText(frame, status, (100, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)
                #threading.Thread(target=play_alert_sound).start()  # Play sound in a separate thread
                alert_thread = threading.Thread(target=play_alert_sound)
                alert_thread.start()
                print("Sound thread started!")  # Debug message
                drivers_collection.update_one(
                    {"_id": ObjectId(driver_id)},
                    {"$inc": {"sleepy": 1}}
                )
        elif left_blink == 1 or right_blink == 1:
            sleep = 0
            active = 0
            drowsy += 1
            if drowsy > 6:
                status = "Drowsy !"
                color = (0, 0, 255)  # Yellow for drowsy
                cv2.putText(frame, status, (100, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)
                drivers_collection.update_one(
                    {"_id": ObjectId(driver_id)},
                    {"$inc": {"drowsy": 1}}
                )
        else:
            drowsy = 0
            sleep = 0
            active += 1
            if active > 6:
                status = "Active :)"
                color = (0, 255, 0)  # Green for active
                cv2.putText(frame, status, (100, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)
                drivers_collection.update_one(
                    {"_id": ObjectId(driver_id)},
                    {"$inc": {"active": 1}}
                )

        # Draw landmarks on the face
        for n in range(0, 68):
            (x, y) = landmarks[n]
            cv2.circle(face_frame, (x, y), 1, (255, 255, 255), -1)

    # Show the frame with detection results
    # cv2.imshow("Frame", frame)
    # cv2.imshow("Result of detector", face_frame)
    cv2.namedWindow("Drowsiness Detection", cv2.WINDOW_NORMAL)
    cv2.setWindowProperty("Drowsiness Detection", cv2.WND_PROP_TOPMOST, 1)
    combined_frame = np.hstack((frame, face_frame))
    cv2.imshow("Drowsiness Detection", combined_frame)

    # Exit condition (Esc key to quit)
    key = cv2.waitKey(1)
    if key == 27  & 0xFF :  # Esc key
        break

# Release the camera and close all windows
cap.release()
cv2.destroyAllWindows()
