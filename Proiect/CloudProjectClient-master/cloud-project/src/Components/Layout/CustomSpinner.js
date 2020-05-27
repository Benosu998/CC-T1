import React from "react";
import styled from "styled-components";
import {Spin} from "antd";

const CustomSpinner = () => {
    return (
        <SpinWrapper>
            <Spin size='large'/>
        </SpinWrapper>
    )
};

const SpinWrapper = styled.div`
    text-align: center;
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 30px 50px;
    margin: 20px 0;
`;

export default CustomSpinner;