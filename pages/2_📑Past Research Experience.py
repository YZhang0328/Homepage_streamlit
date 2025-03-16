import streamlit as st

st.set_page_config(layout="wide")

# ---- Research introduction ----
with st.container():
    st.write("---")
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
        <p style="font-size: 20px;"><b>The following work was accomplished during my academic journey:</b></p>
        <ul>
            <li style="font-size: 20px;">postdoctoral research:</li>
            <li style="font-size: 18px;">Developed an optimization framework for wave energy converters (WECs) to minimize its levelized cost of electricity (LCOE) via mixed integer nonlinear programming (MINLP) and robust optimization theory.</li>
            <li style="font-size: 18px;">Conduct the parameter sensitivity analysis to system performance, i.e., mining parameters that can enhance WEC productivity and efficiency, while reducing LCoE.</li>
            <li style="font-size: 18px;">Representative publications:</li>
            <ol style="font-size: 18px; padding-left: 30px;">
                <li style="margin-left: 15px;">Yujia Zhang and Guang Li. Robust tube-based model predictive control for wave energy converters. IEEE Transactions on Sustainable Energy (2022).</li>
                <li style="margin-left: 15px;">Yujia Zhang, Hongbiao Zhao, Guang Li, Christopher Edwards, and Mike Belmont. Robust nonlinear model predictive control of an autonomous launch and recovery system. IEEE Transactions on Control Systems Technology (2023).</li>
                <li style="margin-left: 15px;">Yujia Zhang, Guang Li and Mustafa Al-Ani. Robust Learning-based Model Predictive Control for Wave Energy Converters. IEEE Transactions on Sustainable Energy (2024).</li>
                <li style="margin-left: 15px;">Yujia Zhang and Guang Li. Towards Robust and High-performance Operations of Wave Energy Converters: an Adaptive Tube-based Model Predictive Control Approach. IFAC-PapersOnLine, 55(31):339-344, 2022.</li>
            </ol>
        </ul>

        <ul>
            <li style="font-size: 20px;">Doctoral research:</li>
            <li style="font-size: 18px;">Developed an optimization framework for wave energy converters (WECs) to minimize its levelized cost of electricity (LCOE) via mixed integer nonlinear programming (MINLP) and robust optimization theory.</li>
        </ul>

        """, 
        unsafe_allow_html=True
    )



