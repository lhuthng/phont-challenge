import React, { useEffect, useState } from "react";
import { BoxContainer } from "../common_styles";
import styled from "styled-components";

const Container = styled(BoxContainer)`
    height: 30%;
`;

const TimeStampContainer = styled.div`
    position: relative;
    box-sizing: border-box;
    padding: 0 1rem 0 1rem;
    width: 100%;
    height: 1rem;
`

const TimeStampBar = styled.div`
    position: relative;
    width: 100%;
    height: 1rem;
`;

const Bar = styled.div`
    position: relative;
    box-sizing: border-box;
    padding: 0 1rem 0 1rem;
    width: 100%;
    top: 1.5rem;
    height: 3rem;
`;

const TimeStamp = styled.div<{p: number}>`
    position: absolute;
    left: ${(props) => props.p}%;
    transform: translateX(-50%);
    color: white;
`;

const SVG = styled.svg`
    box-sizing: border-box; 
    width: 100%;
    height: 100%;
    overflow: visible;
`;

function toTimeString(time: number) {
    const seconds = time % 60;
    const minutes = (time / 60 >> 0) % 60;
    const hours = time / 3600 >> 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

interface Subtitle {
    start_time: number;
    end_time: number;
    subtitle: string;
};


const Timeline: React.FC<{ subtitles: Subtitle[], time: number, startTime: number | undefined, endTime: number | undefined, updateTime: (percent: number) => void}> = ({ subtitles, startTime, time, endTime, updateTime}) => {
    const thirtySeconds = 30;
    const fiveSeconds = 5;
    const valid = startTime !== undefined && endTime !== undefined;

    function calculatePercent(time: number) {
        if (!valid) return 0;
        let percent = 100 * time / (endTime - startTime);
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        return percent;
    }

    function drawTimeStampLabel(index: number, gap: number) {
        if (!valid) return <></>;
        const percent = calculatePercent(gap * (index + 1));
        return <TimeStamp key={index} p={percent}>{toTimeString(startTime + gap * (index + 1))}</TimeStamp>;
    }

    function drawTimeStampLine(index: number, gap: number, color="white") {
        if (!valid) return <></>;
        const percent = `${calculatePercent(gap * (index + 1))}%`;
        return <line key={index} x1={percent} y1="5" x2={percent} y2="45" stroke={color} strokeWidth="2" />;
    }

    function drawSubtitleTimeStampBar(subtitle: Subtitle, index: number) {
        if (!valid) return <></>;
        const percent1 = `${calculatePercent(subtitle.start_time)}%`; 
        const percent2 = `${calculatePercent(subtitle.end_time)}%`;
        return <line key={index} x1={percent1} y1="25" x2={percent2} y2="25" stroke="lime" strokeWidth="10" />
    }

    function drawCurrentTimeStampLine(time: number) {
        if (!valid) return <></>;
        const percent = `${calculatePercent(time)}%`;
        return <line x1={percent} y1="0" x2={percent} y2="50" stroke='red' strokeWidth="2"/>;
    }

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const divElement = event.currentTarget;
        const rect = divElement.getBoundingClientRect();
        const padding = parseFloat(getComputedStyle(divElement).paddingLeft);
        const x = event.clientX - rect.left - padding;
        updateTime(x / (divElement.clientWidth - 2 * padding));
    };

    return (
        <Container>
            <TimeStampContainer>
                <TimeStampBar>
                    <TimeStamp p={0}>{valid ? toTimeString(startTime) : 'NaN'}</TimeStamp> 
                    <TimeStamp p={100}>{valid ? toTimeString(endTime) : 'NaN'}</TimeStamp>
                    {startTime && endTime && Array.from({ length: (endTime - startTime) / thirtySeconds >> 0}, (_, index) => {
                        return drawTimeStampLabel(index, thirtySeconds);
                    })}
                </TimeStampBar>
            </TimeStampContainer>
            <Bar onClick={handleClick}>
                <SVG >
                    <line x1="0" y1="25" x2="100%" y2="25" stroke="white" strokeWidth="2" />
                    <line x1="100%" y1="0" x2="100%" y2="50" stroke="white" strokeWidth="2" />
                    <line x1="0" y1="0" x2="0" y2="50" stroke="white" strokeWidth="2" />
                    {valid && Array.from({ length: (endTime - startTime) / thirtySeconds >> 0}, (_, index) => {
                        return drawTimeStampLine(index, thirtySeconds);
                    })}
                    {valid && Array.from({ length: (endTime - startTime) / fiveSeconds >> 0}, (_, index) => {
                        if (((index + 1) * fiveSeconds) % thirtySeconds == 0) return <></>;
                        return drawTimeStampLine(index, fiveSeconds);
                    })}
                    {valid && subtitles.map((subtitle, index) => {
                        return drawSubtitleTimeStampBar(subtitle, index);
                    })}
                    {drawCurrentTimeStampLine(time)}
                </SVG>
            </Bar>
        </Container>
    );
};

export default Timeline;