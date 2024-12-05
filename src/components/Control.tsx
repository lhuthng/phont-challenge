import React from "react";
import { BoxContainer } from "../common_styles";
import styled from "styled-components";

const Container = styled(BoxContainer)`
    width: 30%;
`;

const Control: React.FC = () => {
    return (
        <Container></Container>
    );
};

export default Control;