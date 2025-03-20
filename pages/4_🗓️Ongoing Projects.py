import streamlit as st
from PIL import Image
import cv2
import os

st.set_page_config(layout="wide")

# Load the image using OpenCV and save it in PNG format
image_path = "images/under_construction.png"

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
        output_path = "images/under_construction.png"
        cv2.imwrite(output_path, bgra)

        # ---- HEADER SECTION ----
        st.title("Data Tools for Volatility Modeling and Forecasting")

        # Display the image
        img_contact_form = Image.open(output_path)
        st.image(img_contact_form, caption="Page under construction", width=300)


        st.title("Crypto Asset Allocation and Portfolio Optimization")

        # Display a message
        st.header("This page is under construction 😎")
