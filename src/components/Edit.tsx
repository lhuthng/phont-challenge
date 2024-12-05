import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Display from "./Display";
import SubtitleDisplay from "./SubtitleDisplay";
import Timeline from "./Timeline";

const Container = styled.div`
    width: auto;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 1rem;
`

interface Subtitle {
    start_time: number;
    end_time: number;
    subtitle: string;
};

const Edit: React.FC = () => {
    const [ subtitles, setSubtitles ] = useState<Subtitle[]>([]);
    const [ time, setTime ] = useState(0);
    const [ playing, setPlaying ] = useState(false);
    const [ startTime, setStartTime ] = useState<number | undefined>(undefined);
    const [ endTime, setEndTime ] = useState<number | undefined>(undefined);
    const [ index, setIndex ] = useState<number>(-1);
    const timeRef = useRef<number | null>(null);
    const fps = 30;
    const renderTime = 1/fps;

    function updateTime(percent: number) {
        if (startTime !== undefined && endTime !== undefined) {
            setTime(prev => {
                const newTime = startTime + percent * (endTime - startTime);
                setIndex(_ => {
                    for (let i = 0; i < subtitles.length; i++) {
                        if (subtitles[i].start_time >= newTime) return i - 1;
                    }
                    return subtitles.length - 1;
                });
                return newTime;
            });
            
        }
    }

    function togglePlaying() {
        if (playing) {
            if (timeRef.current !== null) clearInterval(timeRef.current);
        }
        else {
            timeRef.current = window.setInterval(() => {
                setTime(prev => {
                    setIndex(iPrev => {
                        if (iPrev < subtitles.length - 1) {
                            if (prev >= subtitles[iPrev + 1].start_time) {
                                return iPrev + 1; 
                            }
                        }
                        return iPrev;
                    });
                    if (endTime != undefined && prev > endTime) {
                        if (timeRef.current !== null) clearInterval(timeRef.current);
                        return endTime;
                    }
                    return prev + renderTime;
                });
            }, renderTime * 1000);
        }
        setPlaying(prev => !prev);
    }

    useEffect(() => {
        const fetchSubtitles = async () => {
            try {
                const response = await fetch('/assests/subtitles/output_from_ourAPI.json');
                const data = await response.json();
                setSubtitles(data);
                setStartTime(data.length > 0 ? Math.floor(data[0].start_time) : undefined);
                setEndTime(data.length > 0 ? Math.ceil(data[data.length - 1].end_time) : undefined);
            }
            catch (error) {
                console.log("Got" + error);
            }
        }

        fetchSubtitles();
        return () => {
            if (timeRef.current !== null) clearInterval(timeRef.current);
        }
    }, []);
    return (
        <Container>
            <Display onTogglePlaying={togglePlaying}></Display>
            <SubtitleDisplay subtitle={subtitles[index]} time={time}></SubtitleDisplay>
            <Timeline subtitles={subtitles} time={time} startTime={startTime} endTime={endTime} updateTime={updateTime}></Timeline>
        </Container>
    );
};

export default Edit;