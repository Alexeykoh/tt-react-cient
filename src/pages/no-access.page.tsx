import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../app/router/routes.enum";

const NoAccessPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div>
      <h1>Доступ к ресурсу ограничен</h1>
      <p>
        У вас нет доступа к этому ресурсу. Пожалуйста, свяжитесь с
        администратором, если вы считаете, что это ошибка.
      </p>
      <button onClick={handleGoHome} style={{ marginTop: "20px" }}>
        Вернуться на главную
      </button>
    </div>
  );
};

export default NoAccessPage;
