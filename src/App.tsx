import React from 'react';
import SideBar from './components/SideBar';
import styled from 'styled-components';
import Control from './components/Control';
import Edit from './components/Edit';

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const EditingContainer = styled.div`
  width: 100%;
  max-height: 100%;
  display: flex;
  padding: 1rem;
  gap: 1rem;
`;

const App: React.FC = () => {
  return (
    <MainContainer>
      <SideBar></SideBar>
      <EditingContainer>  
        <Control></Control>
        <Edit></Edit>
      </EditingContainer>
    </MainContainer>
  )
};

export default App;