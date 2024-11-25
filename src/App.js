import React, { useState } from "react";
import { PlusCircleIcon, UserGroupIcon } from "@heroicons/react/24/outline"; // Импорт иконок
import AdForm from "./AdForm";

const App = () => {
  const [activeTab, setActiveTab] = useState("home"); // Активная вкладка
  const [iframeComponent, setIframeComponent] = useState(null); // Сохраняем iframe

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "external" && !iframeComponent) {
      // Загружаем iframe только один раз
      setIframeComponent(<IframeComponent url="https://edhit.github.io/saudi_projects_react/" />);
    }
  };

  return (
    <div className="bg-white flex flex-col mb-16">
      {/* Основной контент */}
      <div className="flex-grow overflow-auto">
        {activeTab === "home" && <AdForm />}
        {activeTab === "external" && iframeComponent}
      </div>

      {/* Нижнее меню */}
      <div className="flex justify-around items-center bg-white text-black border-t-2 fixed bottom-0 left-0 right-0">
        <MenuButton
          label="Форма"
          Icon={PlusCircleIcon}
          active={activeTab === "home"}
          onClick={() => handleTabChange("home")}
        />
        <MenuButton
          label="Группы"
          Icon={UserGroupIcon}
          active={activeTab === "external"}
          onClick={() => handleTabChange("external")}
        />
      </div>
    </div>
  );
};

// Компонент для кнопки меню
const MenuButton = ({ label, Icon, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center px-4 py-2 ${
        active ? "text-blue-500" : "text-gray-400"
      } hover:text-blue-400`}
    >
      <Icon className="h-6 w-6 mb-1" /> {/* Иконка */}
      <span className="text-sm">{label}</span>
    </button>
  );
};

// Компонент для загрузки страницы по URL (вкладка 2)
const IframeComponent = ({ url }) => {
  return (
    <iframe
      src={url}
      title="Внешний сайт"
      className="w-full h-screen"
      frameBorder="0"
    ></iframe>
  );
};

export default App;
