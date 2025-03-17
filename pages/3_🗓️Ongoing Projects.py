import streamlit as st
from PIL import Image
import cv2

st.set_page_config(layout="wide")

# Load the image using OpenCV and save it in PNG format
image_path = "images/under_construction_1.jpg"
image = cv2.imread(image_path)

# Convert from BGR to RGB for PIL compatibility
bgra = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Save the image as PNG
cv2.imwrite("images/under_construction_1.png", bgra)

# ---- HEADER SECTION ----
st.title("Optimizing Crypto Asset Portfolios with Data Driven Techniques")
st.title("Under Construction")

# Display the image
img_contact_form = Image.open("images/under_construction_1.png")
st.image(img_contact_form, caption="Page under construction", use_column_width=True)

# Display a message
st.write("This page is under construction. Please check back later!")
