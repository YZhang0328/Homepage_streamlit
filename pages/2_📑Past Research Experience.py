import streamlit as st

st.set_page_config(playout="wide")


st.header("Past Research Experience")

# ---- Research introduction ----
with st.container():
    st.write("---")
    st.write("##")
    st.markdown(
        '<p style="font-size: 18px;"> I am a former postdoctoral research scientist and have served as a reviewer for several prestigious journals. Additionally, I have been invited to speak at various academic conferences. </p>',
        unsafe_allow_html=True
    )

    st.markdown(
        """
        <p style="font-size: 20px;"><b>The following work was accomplished during my postdoctoral research:</b></p>
        <ul>
            <li style="font-size: 18px;">Developed an optimization framework for wave energy converters (WECs) to minimize its levelized cost of electricity (LCOE) via mixed integer nonlinear programming (MINLP) and robust optimization theory.</li>
            <li style="font-size: 18px;">Conduct the parameter sensitivity analysis to system performance, i.e., mining parameters that can enhance WEC productivity and efficiency, while reducing LCoE.</li>
            <li style="font-size: 18px;">Representative publications:</li>
            <li style="font-size: 18px;">[1] Yujia Zhang and Guang Li. Robust tube-based model predictive control for wave energy converters. IEEE Transactions on Sustainable Energy (2022).</li>
            <li style="font-size: 18px;">[2] Yujia Zhang, Hongbiao Zhao, Guang Li, Christopher Edwards, and Mike Belmont. Robust nonlinear model predictive control of an autonomous launch and recovery system. IEEE Transactions on Control Systems Technology (2023).</li>
            <li style="font-size: 18px;">[3] Yujia Zhang, Guang Li and Mustafa Al-Ani. Robust Learning-based Model Predictive Control for Wave Energy Converters. IEEE Transactions on Sustainable Energy (2024).</li>
            <li style="font-size: 18px;">[4] Yujia Zhang and Guang Li. Towards Robust and High-performance Operations of Wave Energy Converters: an Adaptive Tube-based Model Predictive Control Approach. IFAC-PapersOnLine, 55(31):339-344, 2022.</li>
        </ul>
        """, 
        unsafe_allow_html=True
    )
    st.markdown(
        '<p style="font-size: 20px;"> If this sounds interesting to you, feel free to contact me at the end of the page, and stay tuned for more content!  </p>',
        unsafe_allow_html=True
    )


