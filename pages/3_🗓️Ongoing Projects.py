import requests
import streamlit as st
from streamlit_lottie import st_lottie
from PIL import Image
import cv2
import numpy as np

st.set_page_config(layout="wide")


def load_lottieurl(url):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()


# Use local CSS
def local_css(file_name):
    with open(file_name) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)


local_css("style/style.css")


image = cv2.imread("images/under_construction_1.jpg")

height, width = image.shape[:2]
mask = np.zeros((height, width), dtype=np.uint8)
# create a circle mask
cv2.circle(mask, (width//2, height//2), min(width, height)//2, 255, -1)
# apply the mask
result = cv2.bitwise_and(image, image, mask=mask)

# make the background transparent
bgra = cv2.cvtColor(result, cv2.COLOR_BGR2BGRA)
bgra[:, :, 3] = mask  

# save the image
cv2.imwrite("images/under_construction_1.png", bgra)

# ---- LOAD ASSETS ----
lottie_coding = load_lottieurl("https://assets5.lottiefiles.com/packages/lf20_fcfjwiyb.json")
img_contact_form = Image.open("images/under_construction_1.png")

# ---- HEADER SECTION ----
st.title("Under construction")