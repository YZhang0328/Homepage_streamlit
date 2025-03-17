import streamlit as st
from PIL import Image
import cv2
import os

st.set_page_config(layout="wide")

# Load the image using OpenCV and save it in PNG format
image_path = "images/under_construction_1.jpg"

# Check if the image file exists
if not os.path.exists(image_path):
    st.error(f"Image file not found at {image_path}")
else:
    image = cv2.imread(image_path)

    # Check if the image is loaded correctly
    if image is None:
        st.error(f"Failed to load the image from {image_path}")
    else:
        # Convert from BGR to RGB for PIL compatibility
        bgra = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Save the image as PNG
        output_path = "images/under_construction_1.png"
        cv2.imwrite(output_path, bgra)

        # ---- HEADER SECTION ----
        st.title("Optimizing Crypto Asset Portfolios with Data Driven Techniques")
        st.title("Under Construction")

        # Display the image
        img_contact_form = Image.open(output_path)
        st.image(img_contact_form, caption="Page under construction", use_column_width=True)

        # Display a message
        st.write("This page is under construction :)")
