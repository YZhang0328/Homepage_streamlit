import streamlit as st

with st.container():
    st.write("---")
    left_column, right_column = st.columns(2)
    with left_column:
        st.header("What I do")
        st.write("##")
        st.write(
            """
            Yujia is a former postdoctoral research scientist at the University of Manchester and a dedicated ambassador for women in engineering. She serves as a reviewer for several prestigious journals, including IEEE Transactions on Industrial Engineering, IEEE Transactions on Sustainable Energy, and IEEE Transactions on Control Systems Technology, ocean engineering, etc. She has been an invited speaker at many academic conferences.
 
            The following work was accomplished during her postdoctoral research:
            - Developed an optimization framework for wave energy converters (WECs) to minimize its levelized cost of electricity (LCOE) via mixed integer nonlinear programming (MINLP) and robust optimization theory.
            - Conduct the parameter sensitivity analysis to system performance, i.e., mining parameters that can enhance WEC productivity and efficiency, while reducing LCoE.
             
            Representative publications:
            [1] Yujia Zhang and Guang Li. Robust tube-based model predictive control for wave energy converters. IEEE Transactions on Sustainable Energy (2022).
            [2] Yujia Zhang, Hongbiao Zhao, Guang Li, Christopher Edwards, and Mike Belmont. Robust nonlinear model predictive control of an autonomous launch and recovery system. IEEE Transactions on Control Systems Technology (2023).
            [3] Yujia Zhang, Guang Li and Mustafa Al-Ani. Robust Learning-based Model Predictive Control for Wave Energy Converters. IEEE Transactions on Sustainable Energy (2024).
            [4] Yujia Zhang and Guang Li. Towards Robust and High-performance Operations of Wave Energy Converters: an Adaptive Tube-based Model Predictive Control Approach. IFAC-PapersOnLine, 55(31):339-344, 2022.
            [5] Hongbiao Zhao, Xiaowei Gao, Yujia Zhang, and Xianku Zhang. Nonlinear control of decarbonization path following underactuated ships. Ocean Engineering 272 (2023).
            """
        )

st.title("Past Research Experience")