import streamlit as st
from PIL import Image

st.set_page_config(layout="wide")

# ---- Research introduction ----

with st.container():
    text_column, image_column = st.columns((4, 3))
    with text_column:
        st.subheader("I'm a strong believer in the power of math and quantitative technologies to drive innovation and solve complex problems. ")

        # Use st.markdown separately
        st.markdown(
            '<p style="font-size: 20px;"> In most of my research, I worked extensively with mathematics, focusing on an algorithm called model predictive control, a powerful approach that integrates <b>Optimization</b> and <b>prediction</b> to enhance decision-making in dynamic systems.  </p>',
            unsafe_allow_html=True
        )
        
        st.markdown(
            '<p style="font-size: 20px;"> Beyond control theory, I have also gained substantial experience in machine learning, leveraging data-driven approaches to enhance system modeling, do prediction and classification. </p>',
            unsafe_allow_html=True
        )

        st.markdown(
            '<p style="font-size: 20px;"> I have approximately one year of postdoctoral research experience, endorsed by UK Research and Innovation (UKRI) and the Royal Society of Engineering. During that time, I have served as a reviewer for prestigious journals. Additionally, I was an invited speaker for symposiums and academic conferences. </p>',
            unsafe_allow_html=True
        )

        st.markdown(
            """
            <p style="font-size: 22px;">The following work was accomplished during my postdoctoral research, where I've </p>
            <ul>
                <li style="font-size: 20px;"> Developed an optimization framework for wave energy converters (WECs) to minimize levelized cost of electricity (LCOE) via mixed integer nonlinear programming (MINLP) and robust optimization. </li>
                <li style="font-size: 20px;"> Conduct the parameter sensitivity analysis to system performance, i.e., mining parameters that can enhance WEC productivity and efficiency, while reducing LCoE. </li>
            </ul>
            """, 
            unsafe_allow_html=True
        )

        st.markdown(
            '<p style="font-size: 20px;"> During my PhD, I worked on data-driven renewable energy system modelling and control, where I\'ve </p>',
            unsafe_allow_html=True
        )

        st.markdown(
            """
            <ul>
                <li style="font-size: 20px;"> Developed a WEC model through black-box system identification using historical input-output data. </li>
                <li style="font-size: 20px;"> Designed a linear optimal controller using quadratic programming (QP) to maximize wave energy under uncertainties, and validated its effectiveness through wave tank testing experiments. </li>
                <li style="font-size: 20px;"> Designed a quantile regression-based machine learning algorithm to quantify uncertainties, which significantly enlarged the feasibility region of the control problem. </li>
            </ul>
            """, 
            unsafe_allow_html=True
        )


    with image_column:
        st.image("images/background_picture.png")


st.write("---")
with st.container():
    st.markdown(
        """
        <p style="font-size: 22px;"><b>Representative publications:</b></p>
        <ul>
            <li style="font-size: 20px;"> Yujia Zhang and Guang Li. Robust tube-based model predictive control for wave energy converters. IEEE Transactions on Sustainable Energy (2022). </li>
            <li style="font-size: 20px;"> Yujia Zhang, Hongbiao Zhao, Guang Li, Christopher Edwards, and Mike Belmont. Robust nonlinear model predictive control of an autonomous launch and recovery system. IEEE Transactions on Control Systems Technology (2023). </li>
            <li style="font-size: 20px;"> Yujia Zhang, Guang Li and Mustafa Al-Ani. Robust Learning-based Model Predictive Control for Wave Energy Converters. IEEE Transactions on Sustainable Energy (2024). </li>
            <li style="font-size: 20px;"> Yujia Zhang and Guang Li. Towards Robust and High-performance Operations of Wave Energy Converters: an Adaptive Tube-based Model Predictive Control Approach. IFAC-PapersOnLine, 55(31):339-344, 2022. </li>
        </ul>
        """, 
        unsafe_allow_html=True
    )

st.write("---")


with st.container():
    text_column, image_column = st.columns((2, 1))
    with text_column:
        st.write("##")
        st.markdown(
            '<p style="font-size: 18px;"> I am a former postdoctoral research scientist and have served as a reviewer for several prestigious journals. Additionally, I have been invited to speak at various academic conferences. </p>',
            unsafe_allow_html=True
        )

        # text-indent: -25px; → Moves the first line (numbered part) 25px to the left.
        # padding-left: 25px; → Ensures the rest of the text stays aligned after the number.
        # list-style: none; → Removes the default bullet styling since you're using custom numbering.
        # &nbsp; → Adds spaces before the list item to align it with the text above.
        st.markdown(
            """
            <ul>
                <p style="font-size: 20px;"><b>-&nbsp;&nbsp;Machine learning research experience:</b></p>
                <li style="font-size: 18px;"><b>Worked on deep Learning for Weakly Supervised Target Detection in Remote Sensing images.<b></li>
                <li style="font-size: 18px;">Developed a target detection framework using few image samples, which is achieved by feeding the samples to multiple neural networks (NNs) in an easy-to-difficult order, known as the self-paced learning strategy.</li>
                <li style="font-size: 18px;">The framework can generate more pseudo bounding boxes and improved the accuracy of the bounding boxes by updating each NN during the training process, till the convergence of a defined loss function.</li>
            </ul>

            """, 
            unsafe_allow_html=True
        )
    with image_column:
        Image.open("images/background_picture.png")


