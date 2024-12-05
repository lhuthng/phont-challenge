import React from "react";
import { BoxContainer } from "../common_styles";
import styled from "styled-components";

const Container = styled(BoxContainer)`
    height: 60%;
`

const Display: React.FC<{onTogglePlaying: () => void}> = ({ onTogglePlaying }) => {
    return (
        <Container>
            <button onClick={() => onTogglePlaying()}>Play</button>
        </Container>
    );
};

export default Display;