import React from "react";
import { BoxContainer } from "../common_styles";
import styled from "styled-components";

const Container = styled(BoxContainer)`
    width: 100%;
    height: 20%;
    color: white;
`;

interface Subtitle {
    start_time: number;
    end_time: number;
    subtitle: string;
};

const SubtitleDisplay: React.FC<{ subtitle: Subtitle | undefined, time: number }> = ({ subtitle, time }) => {
    return (
        <Container>
            <div>{subtitle && subtitle.end_time >= time && subtitle.subtitle}</div>
        </Container>
    );
};

export default SubtitleDisplay;