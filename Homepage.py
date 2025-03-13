import requests
import streamlit as st
from streamlit_lottie import st_lottie
from PIL import Image
import cv2
import numpy as np


# Find more emojis here: https://www.webfx.com/tools/emoji-cheat-sheet/
st.set_page_config(page_title="Yujia's homepage", page_icon=":house_with_garden:", layout="wide")


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


image = cv2.imread("images/Photo_Yujia.jpg")

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
cv2.imwrite("images/Yujia_Photo.png", bgra)

# ---- LOAD ASSETS ----
lottie_coding = load_lottieurl("https://assets5.lottiefiles.com/packages/lf20_fcfjwiyb.json")
img_contact_form = Image.open("images/Yujia_Photo.png")
img_lottie_animation = Image.open("images/yt_lottie_animation.png")

# ---- HEADER SECTION ----

with st.container():
    image_column, text_column = st.columns((1, 2))
    with image_column:
        st.image(img_contact_form)
    with text_column:
        st.title("Hi, I am Yujia Zhang :wave:")
        st.subheader("An industrial mathematician with an interest and experience in the mathematical modelling of real-world problems.")
        
        # Use st.markdown separately
        st.markdown(
            '<p style="font-size: 21px;"> I am passionate about applying quantitative methods and statistical modeling to capture the volatility of capital markets, with a strong intellectual curiosity to explore the mathematics behind data patterns. </p>',
            unsafe_allow_html=True
        )

        st.markdown(
            """
            <p style="font-size: 21px;"><b>My expertise lies in optimization and prediction.</b></p>
            <ul>
                <li style="font-size: 20px;"><b>Optimization:</b> My experience focuses on transforming intricate regulatory and financial constraints into structured, solvable frameworks. Whether ensuring compliance with evolving market regulations or optimizing resource allocation, I build solutions that balance efficiency and robustness.</li>
                <li style="font-size: 20px;"><b>Prediction:</b> I analyze trends and anomalies within data series using both linear and nonlinear models. I help businesses anticipate market movements, optimize strategies, and make informed financial decisions.</li>
            </ul>
            """, 
            unsafe_allow_html=True
        )

        # Regular st.write for text
        file_path = 'CV/CV_YUJIA.pdf'

        # Create a markdown link
        st.write("[Learn more about me>](https://www.linkedin.com/in/yujia-zhang-94417a295/)")
        with open(file_path, "rb") as pdf_file:
            btn = st.download_button(
                label="Download My CV",
                data=pdf_file,
                file_name="CV_YUJIA.pdf",
                mime="CV_for_application/pdf"
            )


# ---- WHAT I DO ----
with st.container():
    st.write("---")
    text_column, image_column = st.columns((0.7, 0.3))
    with text_column:
        st.header("What I do")
        st.write("##")
        st.markdown(
            '<p style="font-size: 22px;"> I have a PhD in engineering. I subsequently worked as a postdoctoral research scientist from the University of Manchester. I am also a dedicated ambassador for women in engineering.  </p>',
            unsafe_allow_html=True
        )
        st.markdown(
            '<p style="font-size: 22px;"> After transitioning from academia, I now work as an energy modeller specializing in energy market optimization.  </p>',
            unsafe_allow_html=True
        )

        st.markdown(
            """
            <p style="font-size: 21px;"><b>My daily responsibilities include:</b></p>
            <ul>
                <li style="font-size: 20px;">Working with Excel and Python, especially Pandas, to analyze and process large energy market datasets—including demand, supply, plant, region, and interflow data. I develop models that optimize electricity distribution across various sources such as gas, coal, solar, wind, hydro, and interconnectors. These models generate price forecasts and market trends to support financial decision-making in energy portfolios.</li>
                <li style="font-size: 20px;">Adding features to market models, identifying input and modeling anomalies to ensure robustness.</li>
                <li style="font-size: 20px;">Running scenario analyses to evaluate the impact of technological advancements, policy shifts, and economic trends on energy prices.</li>
                <li style="font-size: 20px;">Constantly refining models and thinking, "There has to be a better way.</li>
            </ul>
            """, 
            unsafe_allow_html=True
        )
        st.markdown(
            '<p style="font-size: 22px;"> If this sounds interesting to you, feel free to contact me at the end of the page, and stay tuned for more content!  </p>',
            unsafe_allow_html=True
        )
    with image_column:
        st_lottie(lottie_coding, height=400, key="coding")

# ---- PROJECTS ----
with st.container():
    st.write("---")
    st.header("My Projects")
    st.write("##")
    image_column, text_column = st.columns((1, 2))
    with image_column:
        st.image(img_lottie_animation)
    with text_column:
        st.subheader("Integrate Lottie Animations Inside Your Streamlit App")
        st.write(
            """
            Learn how to use Lottie Files in Streamlit!
            Animations make our web app more engaging and fun, and Lottie Files are the easiest way to do it!
            In this tutorial, I'll show you exactly how to do it
            """
        )
        st.markdown("[Watch Video...](https://youtu.be/TXSOitGoINE)")

# ---- CONTACT ----
with st.container():
    st.write("---")
    st.header("Get In Touch With Me!")
    st.write("##")

    # Documention: https://formsubmit.co/ !!! CHANGE EMAIL ADDRESS !!!
    contact_form = """
    <form action="https://formsubmit.co/yujia.zhang.uom@gmail.com" method="POST">
        <input type="hidden" name="_captcha" value="false">
        <input type="hidden" name="_next" value="thank_you.html"> <!-- Optional: Redirect after submission -->
        <input type="text" name="name" placeholder="Your name" required>
        <input type="email" name="email" placeholder="Your email" required>
        <textarea name="message" placeholder="Your message here" required></textarea>
        <button type="submit">Send</button>
        <input type="hidden" name="_next" value="thank_you.html">
    </form>
    """
    
    left_column, right_column = st.columns(2)
    with left_column:
        st.markdown(contact_form, unsafe_allow_html=True)
    with right_column:
        st.empty()