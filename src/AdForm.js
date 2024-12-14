import React, { useState, useEffect, useRef } from "react";
import Notification from "./Notification";

const TelegramStyleForm = () => {
  const [greeting, setGreeting] = useState("");
  const [formData, setFormData] = useState({
    role: "Нужен водитель",
    time: "",
    timeOption: "",
    date: "",
    dateOption: "",
    from: "",
    to: "",
    seats: "",
    comment: "",
  });

  const [customCity, setCustomCity] = useState({ from: false, to: false });

  const [generatedMessage, setGeneratedMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false); // копия во все проекты
  const [showTooltip, setShowTooltip] = useState(false); // подсказка
  const [showCopyHint, setShowCopyHint] = useState(false);
  const [highlightCopyButton, setHighlightCopyButton] = useState(false);
  const previewRef = useRef(null);
  const commentRef = useRef(null);
  const [paddingBottom, setPaddingBottom] = useState(0);

  const [showTimeInput, setShowTimeInput] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);

  const cities = ["Медина", "Мекка", "Джидда", "Эр-Рияд"];
  const roles = ["Нужен водитель", "Возьму пассажира(ов)"];

  useEffect(() => {
    // Очистка стилей при размонтировании компонента
    return () => {
      setPaddingBottom(0);
    };
  }, []);

  const handleButtonClick = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (field === "from" || field === "to") {
      setCustomCity({ ...customCity, [field]: value === "" }); // Показать поле ввода, если "Другой"
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerateMessage = () => {
    const messageParts = [];

    // // Добавляем приветствие, если выбрано
    if (greeting) {
      messageParts.push(greeting);
    }

    // Добавляем поля только если они не пустые
    if (formData.role) {
      let icon =
        formData.role === "Нужен водитель"
          ? "🚘"
          : formData.role === "Возьму пассажира(ов)"
          ? "🚘"
          : "🧳";

      messageParts.push(`${icon} ${formData.role}`);
    }

    if (formData.date) {
      messageParts.push(`📅 ${formData.date}`);
    }

    if (formData.time) {
      messageParts.push(`🕓 ${formData.time}`);
    }

    if (formData.from) {
      messageParts.push(`📌 Откуда: ${formData.from}`);
    }

    if (formData.to) {
      messageParts.push(`📍 Куда: ${formData.to}`);
    }

    if (formData.seats) {
      let text =
        formData.role === "Нужен водитель"
          ? "Количество пассажиров"
          : formData.role === "Возьму пассажира(ов)"
          ? "Количество мест"
          : "Вес";

      let kg =
        formData.role !== "Нужен водитель" &&
        formData.role !== "Возьму пассажира(ов)"
          ? "кг"
          : "";
      messageParts.push(`🔢 ${text}: ${formData.seats} ${kg}`);
    }

    if (formData.comment) {
      messageParts.push(`${formData.comment}`);
    }

    const formattedMessage = messageParts.join("\n");
    setGeneratedMessage(formattedMessage);

    // Показать указатель и подсветить кнопку "Копировать"
    setShowCopyHint(true);
    setShowTooltip(true);
    setHighlightCopyButton(true);

    // Скрыть указатель и подсветку через 3 секунды
    setTimeout(() => {
      setShowCopyHint(false);
      setShowTooltip(false);
      setHighlightCopyButton(false);
    }, 3000);

    // Скролл до конца страницы
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000); // Уведомление исчезает через 3 секунды
  };

  const handleFocus = () => {
    // Определение высоты видимой области и поля textarea
    const textareaHeight = commentRef.current?.offsetHeight || 0;

    // Установка отступа, чтобы поле не скрывалось клавиатурой
    const keyboardHeightEstimate = window.innerHeight * 0.35; // Примерная высота клавиатуры (можно уточнить)
    setPaddingBottom(keyboardHeightEstimate + textareaHeight);

    // Прокрутка к полю
    setTimeout(() => {
      commentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  };

  const handleBlur = () => {
    // Сброс отступа при снятии фокуса с поля ввода
    setPaddingBottom(0);
  };

  const handleOptionClick = (option, type) => {
    if (type === "time") {
      setFormData((prevData) => ({
        ...prevData,
        timeOption: option,
        time: option === "Указать время" ? "" : option, // Сброс времени, если "Указать время"
      }));
      setShowTimeInput(option === "Указать время");
    } else if (type === "date") {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2);

      let dateValue = "";
      if (option === "Сегодня") dateValue = today.toISOString().slice(0, 10);
      if (option === "Завтра") dateValue = tomorrow.toISOString().slice(0, 10);
      if (option === "Послезавтра")
        dateValue = dayAfterTomorrow.toISOString().slice(0, 10);

      setFormData((prevData) => ({
        ...prevData,
        dateOption: option,
        date: option === "Указать дату" ? "" : dateValue,
      }));
      setShowDateInput(option === "Указать дату");
    }
  };

  return (
    <div class="container mx-auto">
      <div style={{ paddingBottom: `${paddingBottom}px` }}>
        <div className="max-w-md mx-auto bg-white rounded-xl mb-4">
          <h1 className="block bg-gray-100 p-4 text-xl border border-b-1 text-center font-bold mb-1">
            🇸🇦 Попутка в Саудии
          </h1>
        </div>

        <div className="p-4 pt-0 max-w-md mx-auto bg-white rounded-xl">
          {/* Чекбоксы для приветствия */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Приветствие</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "السلام عليكم", value: "السلام عليكم" },
                {
                  label: "السلام عليكم ورحمة الله وبركاته",
                  value: "السلام عليكم ورحمة الله وبركاته",
                },
                { label: "Без приветствия", value: "" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGreeting(option.value)}
                  className={`px-3 py-2 rounded-xl ${
                    greeting === option.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            {/* <label className="block mb-2 font-semibold">Роль</label> */}
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleButtonClick("role", role)}
                  className={`block px-3 py-2 text-xl rounded-xl cursor-pointer w-full text-center ${
                    formData.role === role
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="mb-4">
            {/* Выбор даты */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Дата:</label>

              {/* Кнопки для выбора даты */}
              <div className="flex flex-wrap gap-2 mb-4">
                {["Сегодня", "Завтра", "Послезавтра", "Указать дату"].map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      className={`px-3 py-2 rounded-xl ${
                        formData.dateOption === option
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => handleOptionClick(option, "date")}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>

              {/* Поле ввода даты */}
              {showDateInput && (
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  min={new Date().toJSON().slice(0, 10)}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-xl"
                />
              )}
            </div>
          </div>
          {/* Выбор времени */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Время:</label>

            {/* Кнопки для выбора времени */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                "Сейчас",
                "После Фаджра",
                "После Зухра",
                "После Асра",
                "После Магриба",
                "После Иша",
                "Указать время",
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`px-3 py-2 rounded-xl ${
                    formData.timeOption === option
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => handleOptionClick(option, "time")}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Поле ввода времени */}
            {showTimeInput && (
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-xl"
              />
            )}
          </div>

          {/* From */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Откуда</label>
            <div className="flex gap-2 flex-wrap">
              {cities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleButtonClick("from", city)}
                  className={`px-3 py-2 rounded-xl ${
                    formData.from === city
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {city}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleButtonClick("from", "")}
                className={`px-3 py-2 rounded-xl ${
                  customCity.from
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Другой город
              </button>
            </div>
            {customCity.from && (
              <input
                type="text"
                name="from"
                placeholder="Введите город"
                value={formData.from}
                onChange={handleInputChange}
                className="mt-2 w-full p-2 border rounded-xl"
              />
            )}
          </div>

          {/* To */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Куда</label>
            <div className="flex gap-2 flex-wrap">
              {cities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleButtonClick("to", city)}
                  className={`px-3 py-2 rounded-xl ${
                    formData.to === city
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {city}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleButtonClick("to", "")}
                className={`px-3 py-2 rounded-xl ${
                  customCity.to
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Другой город
              </button>
            </div>
            {customCity.to && (
              <input
                type="text"
                name="to"
                placeholder="Введите город"
                value={formData.to}
                onChange={handleInputChange}
                className="mt-2 w-full p-2 border rounded-xl"
              />
            )}
          </div>

          {/* Seats */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">
              {formData.role === "Нужен водитель"
                ? "Количество пассажиров"
                : formData.role === "Возьму пассажира(ов)"
                ? "Количество мест"
                : "Вес (кг.)"}
            </label>
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-xl"
            />
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Комментарий</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              ref={commentRef}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="block w-full mb-4 p-2 border rounded-xl"
              placeholder={
                formData.role === "Нужен водитель"
                  ? "Есть багаж"
                  : formData.role === "Возьму пассажира(ов)"
                  ? "Возьму посылку, 10 кг. свободно"
                  : "Вес (кг.)"
              }
            ></textarea>
          </div>

          {/* Submit */}
          <button
            onClick={handleGenerateMessage}
            className="w-full mt-4 px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 relative"
          >
            Сгенерировать сообщение
            {showTooltip && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-base px-3 py-1 rounded-xl shadow-lg">
                Проверьте сообщение, скопируйте и вставьте в группу телеграмм
              </div>
            )}
          </button>

          {/* Функция ввывода */}
          {generatedMessage && (
            <div className="mt-4" ref={previewRef}>
              <h3 className="font-bold mb-2">Предпросмотр сообщения</h3>
              <div className="p-3 bg-gray-100 rounded-xl border">
                <pre className="whitespace-pre-wrap">{generatedMessage}</pre>
              </div>
              <div className="relative mt-4">
                {showCopyHint && (
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 -top-4 text-sm text-gray-600 animate-bounce-down"
                    style={{ fontSize: "35px" }}
                  >
                    👇
                  </div>
                )}
                <button
                  onClick={handleCopyToClipboard}
                  className={`w-full mt-2 px-3 py-2 text-white rounded-xl ${
                    highlightCopyButton ? "bg-green-400" : "bg-green-500"
                  } hover:bg-green-600`}
                >
                  Копировать сообщение
                </button>
              </div>
            </div>
          )}

          {showNotification && (
            <Notification
              message="Сообщение скопировано в буфер обмена"
              duration={3000}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TelegramStyleForm;
