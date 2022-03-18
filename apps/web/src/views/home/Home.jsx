import React from 'react';
import { _home, _button } from './Home.styled';
import { PUBLIC_GAME } from 'core/routes/routes';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <_home>
      <_button to={PUBLIC_GAME}>{t('preview.demo')}</_button>
    </_home>
  );
};

export default Home;
