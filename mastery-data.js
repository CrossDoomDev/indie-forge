// Shared catalogue seed. Edit this file or use scripts/import-mastery-catalog.cjs.
window.MASTERY_SEED = {
  "version": 1,
  "technologies": [
    {
      "id": "godot",
      "title": "Godot",
      "category": "engine",
      "description": "Бесплатный и открытый движок для 2D и 3D игр. От первой сцены до собственной игровой системы.",
      "tags": [
        "2D",
        "3D",
        "GDScript",
        "Open Source"
      ],
      "color": "#36b8ff",
      "image": "assets/mastery/godot.svg",
      "icon": "godot",
      "order": 0,
      "published": true,
      "about": "Godot — игровой движок для создания 2D- и 3D-игр. Проект собирается из сцен и узлов: каждый узел отвечает за часть поведения, а сцены можно объединять и использовать повторно.\n\nВ Godot можно работать с игровыми объектами, анимацией, физикой, интерфейсом и звуком. GDScript помогает описывать логику: управление персонажем, взаимодействие с миром и правила игры."
    },
    {
      "id": "gamemaker",
      "title": "GameMaker",
      "category": "engine",
      "description": "Создавайте 2D-игры с помощью визуальных инструментов и языка GML.",
      "tags": [
        "2D",
        "GML",
        "Визуальные скрипты"
      ],
      "color": "#36d995",
      "image": "assets/mastery/gamemaker.svg",
      "icon": "gamemaker",
      "order": 1,
      "published": true,
      "about": "GameMaker — среда для создания 2D-игр. В основе проекта находятся комнаты, объекты и события: вы размещаете игровые элементы и задаёте, как они реагируют на действия игрока.\n\nИнструменты работы со спрайтами и анимацией помогают собрать визуальную часть, а GML — описать движение, столкновения, интерфейс и другие игровые механики."
    },
    {
      "id": "rpgmaker",
      "title": "RPG Maker",
      "category": "engine",
      "description": "Собственные RPG без программирования: миры, персонажи, события и истории.",
      "tags": [
        "2D",
        "RPG",
        "Сюжет",
        "Без кода"
      ],
      "color": "#b2c8f7",
      "image": "assets/mastery/rpgmaker.svg",
      "icon": "rpgmaker",
      "order": 2,
      "published": true,
      "about": "RPG Maker — инструмент для создания ролевых игр. Рабочий процесс строится вокруг карт, персонажей и событий: вы собираете локации, добавляете диалоги и связываете происходящее в игровую историю.\n\nСистема событий позволяет настраивать взаимодействия, переходы между картами, задания и сюжетные сцены. Так можно сосредоточиться на мире, героях и правилах игры, постепенно добавляя нужные механики."
    },
    {
      "id": "blender",
      "title": "Blender",
      "category": "art",
      "description": "3D-моделирование, материалы, анимация и подготовка игровых ассетов.",
      "tags": [
        "3D",
        "Моделирование",
        "Анимация"
      ],
      "color": "#ff913f",
      "image": "assets/mastery/blender.svg",
      "icon": "blender",
      "order": 3,
      "published": true,
      "about": "Blender — инструмент для работы с 3D-графикой. В нём создают модели, настраивают материалы и освещение, собирают сцены и анимируют объекты.\n\nВ разработке игр Blender используют для подготовки персонажей, окружения и предметов. Модель можно подготовить к передаче в игровой движок, сохранив её форму, текстуры и анимацию."
    },
    {
      "id": "aseprite",
      "title": "Aseprite",
      "category": "art",
      "description": "Пиксельные персонажи, тайлсеты и покадровая анимация для ваших игр.",
      "tags": [
        "2D",
        "Пиксель-арт",
        "Анимация"
      ],
      "color": "#c397f4",
      "image": "assets/mastery/aseprite.svg",
      "icon": "aseprite",
      "order": 4,
      "published": true,
      "about": "Aseprite — редактор пиксельной графики и анимации. Работа со слоями, палитрой и отдельными кадрами помогает создавать спрайты персонажей, предметы, тайлы окружения и элементы интерфейса.\n\nНебольшое разрешение требует внимания к силуэту, цвету и движению. В Aseprite можно последовательно собирать кадры анимации и подготавливать графику для использования в игре."
    },
    {
      "id": "unity",
      "title": "Unity",
      "category": "engine",
      "description": "Разработка игр на C#: сцены, компоненты, физика и выпуск на разных платформах.",
      "tags": [
        "2D",
        "3D",
        "C#",
        "Мультиплатформа"
      ],
      "color": "#e4ebef",
      "image": "assets/mastery/unity.svg",
      "icon": "unity",
      "order": 5,
      "published": true,
      "about": "Unity — игровой движок для создания 2D- и 3D-проектов. Сцены состоят из игровых объектов и компонентов, а поведение описывается с помощью C#.\n\nСредства движка объединяют работу с графикой, анимацией, физикой, интерфейсом и звуком. Такая структура позволяет собирать игровой мир из отдельных систем и постепенно развивать проект."
    },
    {
      "id": "web",
      "title": "Web / JavaScript",
      "category": "language",
      "description": "Интерактивные миры в браузере: от основ веба до игр на JavaScript.",
      "tags": [
        "HTML",
        "CSS",
        "JavaScript",
        "WebGL"
      ],
      "color": "#ffdc4e",
      "image": "assets/mastery/web.svg",
      "icon": "web",
      "order": 6,
      "published": true,
      "about": "Веб-технологии позволяют создавать игры и интерактивные приложения для браузера. HTML задаёт структуру страницы, CSS отвечает за внешний вид, а JavaScript — за поведение и взаимодействия.\n\nНа этой основе можно реализовать игровой цикл, управление, интерфейс и сохранение состояния. Браузер становится средой, в которой вы проверяете результат и показываете проект другим людям."
    },
    {
      "id": "csharp",
      "title": "C# / .NET",
      "category": "language",
      "description": "Язык C# и экосистема .NET для игровых систем, приложений и инструментов.",
      "tags": [
        "C#",
        ".NET",
        "ООП",
        "Инструменты"
      ],
      "color": "#b485ff",
      "image": "assets/mastery/csharp.svg",
      "icon": "csharp",
      "order": 7,
      "published": true,
      "about": "C# — язык программирования, а .NET — платформа для разработки и запуска приложений. Вместе они позволяют описывать логику, организовывать данные и строить проект из связанных компонентов.\n\nВ игровой разработке C# используется для механик и инструментов, а за пределами игры — для приложений и серверных сервисов. Основы языка помогают работать с объектами, событиями, коллекциями и архитектурой кода."
    },
    {
      "id": "pixelart",
      "title": "Пиксель-арт",
      "category": "art",
      "description": "Форма, цвет, свет и читаемость маленьких игровых миров.",
      "tags": [
        "2D",
        "Арт",
        "Палитры"
      ],
      "color": "#ff6c98",
      "image": "assets/mastery/pixelart.svg",
      "icon": "pixelart",
      "order": 8,
      "published": true,
      "about": "Пиксель-арт — способ создания графики, в котором каждый пиксель влияет на форму и читаемость изображения. Ограниченный размер рисунка делает особенно важными силуэт, палитру, свет и контраст.\n\nТак создают персонажей, предметы, окружение и интерфейсы для игр. Анимация добавляет движение: отдельные кадры должны не только хорошо выглядеть, но и складываться в понятное действие."
    },
    {
      "id": "audio",
      "title": "Музыка и звук",
      "category": "audio",
      "description": "Атмосферные саундтреки, звуковые эффекты и интерактивное аудио.",
      "tags": [
        "Музыка",
        "SFX",
        "Звук"
      ],
      "color": "#b58bff",
      "image": "assets/mastery/audio.svg",
      "icon": "audio",
      "order": 9,
      "published": true,
      "about": "Музыка и звук помогают передать настроение игры и сделать происходящее понятнее. Фоновая композиция поддерживает атмосферу, а звуковые эффекты сообщают о действиях, событиях и изменениях состояния.\n\nРабота со звуком включает создание и подбор материалов, монтаж, настройку громкости и подготовку игровых петель. Важно, чтобы музыка, окружение и интерфейс звучали согласованно."
    },
    {
      "id": "tools",
      "title": "Инструменты и пайплайн",
      "category": "tools",
      "description": "Git, планирование, сборка и удобный рабочий процесс инди-разработчика.",
      "tags": [
        "Git",
        "Сборка",
        "Команда"
      ],
      "color": "#5bd5d0",
      "image": "assets/mastery/tools.svg",
      "icon": "tools",
      "order": 10,
      "published": true,
      "about": "Инструменты и пайплайн связывают отдельные задачи разработки в рабочий процесс. Контроль версий помогает сохранять историю проекта, сборка — получать запускаемую игру, а автоматизация — повторять необходимые действия.\n\nПродуманный процесс упрощает работу с кодом, графикой и другими ресурсами. Он помогает организовать проект и поддерживать порядок при самостоятельной разработке и в команде."
    },
    {
      "id": "design",
      "title": "Дизайн и геймдев",
      "category": "design",
      "description": "Игровые механики, баланс, уровни и опыт, ради которого возвращаются.",
      "tags": [
        "Геймдизайн",
        "Баланс",
        "Уровни"
      ],
      "color": "#edbb68",
      "image": "assets/mastery/design.svg",
      "icon": "design",
      "order": 11,
      "published": true,
      "about": "Геймдизайн определяет, что делает игрок, какие решения принимает и как игра отвечает на его действия. Правила, цели, ограничения и обратная связь складываются в игровой опыт.\n\nРабота начинается с идеи и прототипа, а затем продолжается проверкой механик, настройкой сложности и баланса. Дизайн уровней и игровых систем помогает связать отдельные элементы в цельную игру."
    },
    {
      "id": "ui",
      "title": "2D / UI / Графика",
      "category": "art",
      "description": "Интерфейсы, иконки и графические системы, которые помогают игроку.",
      "tags": [
        "UI",
        "UX",
        "Графика"
      ],
      "color": "#64c4ff",
      "image": "assets/mastery/ui.svg",
      "icon": "ui",
      "order": 12,
      "published": true,
      "about": "Игровой интерфейс помогает ориентироваться в происходящем: видеть состояние персонажа, выбирать действия и получать обратную связь. Меню, кнопки, иконки и другие элементы должны быть понятными и согласованными.\n\nРабота с 2D-графикой и UI включает композицию, цвет, типографику и подготовку визуальных ресурсов. Хорошо организованный интерфейс поддерживает игровой процесс и остаётся читаемым на разных экранах."
    }
  ],
  "courses": [
    {
      "id": "godot-core-1",
      "technologyId": "godot",
      "branch": "core",
      "title": "Godot с нуля",
      "description": "Установка, интерфейс, сцены и узлы. Соберите свою первую интерактивную сцену.",
      "lessonCount": 3,
      "durationMinutes": 45,
      "topic": "Основы",
      "level": "beginner",
      "order": 1,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Ориентироваться в интерфейсе Godot 4",
        "Различать сцены и узлы",
        "Создавать и запускать простую 2D-сцену",
        "Использовать первые команды GDScript"
      ],
      "curriculum": {
        "version": 3,
        "title": "Godot с нуля",
        "markdown": true,
        "activeId": "welcome",
        "modules": [
          {
            "id": "module-1",
            "title": "Знакомство с Godot",
            "lessonIds": [
              "welcome",
              "scenes"
            ],
            "expanded": true
          },
          {
            "id": "module-2",
            "title": "Первая игра",
            "lessonIds": [
              "exercise"
            ],
            "expanded": true
          }
        ],
        "lessons": [
          {
            "id": "welcome",
            "title": "Введение в Godot 4",
            "html": "<h2>Добро пожаловать в первый урок!</h2><p>В этом уроке мы познакомимся с <strong>Godot 4</strong> и подготовим рабочее пространство для создания 2D-игры.</p><p>Для начала установите движок с <a href=\"https://godotengine.org/download/\">официального сайта Godot</a>.</p><h3>Что мы изучим</h3><ul><li>Из чего состоит проект Godot</li><li>Как устроены сцены и узлы</li><li>Как запустить первую сцену</li></ul><p>Пример GDScript:</p><pre><code>extends Node2D\n\nfunc _ready() -&gt; void:\n    print(\"Привет, мир!\")</code></pre><p style=\"text-align: center\"><em>Начнём создавать свою игру!</em></p>",
            "steps": [
              {
                "id": "welcome-note",
                "type": "note",
                "title": "Конспект",
                "question": "",
                "explanation": "",
                "correctExplanation": "",
                "incorrectExplanation": "",
                "points": 0,
                "html": "<h2>Добро пожаловать в первый урок!</h2><p>В этом уроке мы познакомимся с <strong>Godot 4</strong> и подготовим рабочее пространство для создания 2D-игры.</p><p>Для начала установите движок с <a href=\"https://godotengine.org/download/\">официального сайта Godot</a>.</p><h3>Что мы изучим</h3><ul><li>Из чего состоит проект Godot</li><li>Как устроены сцены и узлы</li><li>Как запустить первую сцену</li></ul><p>Пример GDScript:</p><pre><code>extends Node2D\n\nfunc _ready() -&gt; void:\n    print(\"Привет, мир!\")</code></pre><p style=\"text-align: center\"><em>Начнём создавать свою игру!</em></p>"
              }
            ],
            "activeStepId": "welcome-note"
          },
          {
            "id": "scenes",
            "title": "Сцены и узлы",
            "html": "<h2>Сцены и узлы в Godot</h2><p>Каждая сцена — это дерево <strong>узлов</strong>. Узлы отвечают за отдельные функции игры.</p><ol><li>Создайте сцену.</li><li>Добавьте корневой узел <code>Node2D</code>.</li><li>Сохраните сцену как <code>main.tscn</code>.</li></ol><p>После сохранения сцена готова к дальнейшей работе.</p>",
            "steps": [
              {
                "id": "scenes-note",
                "type": "note",
                "title": "Конспект",
                "question": "",
                "explanation": "",
                "correctExplanation": "",
                "incorrectExplanation": "",
                "points": 0,
                "html": "<h2>Сцены и узлы в Godot</h2><p>Каждая сцена — это дерево <strong>узлов</strong>. Узлы отвечают за отдельные функции игры.</p><ol><li>Создайте сцену.</li><li>Добавьте корневой узел <code>Node2D</code>.</li><li>Сохраните сцену как <code>main.tscn</code>.</li></ol><p>После сохранения сцена готова к дальнейшей работе.</p>"
              }
            ],
            "activeStepId": "scenes-note"
          },
          {
            "id": "exercise",
            "title": "Практическое задание",
            "html": "<h2>Практика: первая сцена</h2><p>Создайте сцену <code>Player</code> и поместите в неё <code>Sprite2D</code>.</p><h3>Критерии выполнения</h3><ul><li>Сцена открывается без ошибок.</li><li>Корневой узел называется <code>Player</code>.</li><li>Спрайт виден при запуске проекта.</li></ul>",
            "steps": [
              {
                "id": "exercise-note",
                "type": "note",
                "title": "Конспект",
                "question": "",
                "explanation": "",
                "correctExplanation": "",
                "incorrectExplanation": "",
                "points": 0,
                "html": "<h2>Практика: первая сцена</h2><p>Создайте сцену <code>Player</code> и поместите в неё <code>Sprite2D</code>.</p><h3>Критерии выполнения</h3><ul><li>Сцена открывается без ошибок.</li><li>Корневой узел называется <code>Player</code>.</li><li>Спрайт виден при запуске проекта.</li></ul>"
              }
            ],
            "activeStepId": "exercise-note"
          }
        ]
      },
      "about": "Познакомьтесь с рабочим пространством Godot 4: разберитесь, как устроены проекты, сцены и узлы, а затем создайте свою первую сцену. Вводные уроки помогут подготовиться к самостоятельной работе над 2D-игрой.",
      "audience": "Начинающие разработчики, которые хотят познакомиться с Godot 4 и начать создавать 2D-игры.",
      "requirements": "Компьютер с установленным Godot 4. Предварительный опыт программирования для вводных уроков не требуется.",
      "learningFormat": "Текстовые уроки, примеры GDScript и практическое задание. Читайте конспекты до конца и переходите к следующему шагу. Продолжить можно с последнего открытого урока."
    },
    {
      "id": "godot-core-2",
      "technologyId": "godot",
      "branch": "core",
      "title": "GDScript с нуля",
      "description": "Переменные, функции, условия, циклы и сигналы в игровом коде.",
      "lessonCount": 14,
      "durationMinutes": 600,
      "topic": "Программирование",
      "level": "beginner",
      "order": 2,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Переменные, функции, условия, циклы и сигналы в игровом коде."
      ]
    },
    {
      "id": "godot-core-3",
      "technologyId": "godot",
      "branch": "core",
      "title": "2D-разработка",
      "description": "Спрайты, анимации, физика и тайлы для создания 2D-мира.",
      "lessonCount": 12,
      "durationMinutes": 720,
      "topic": "2D",
      "level": "intermediate",
      "order": 3,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Спрайты, анимации, физика и тайлы для создания 2D-мира."
      ]
    },
    {
      "id": "godot-core-4",
      "technologyId": "godot",
      "branch": "core",
      "title": "3D-разработка",
      "description": "3D-сцены, модели, материалы, освещение и камера.",
      "lessonCount": 14,
      "durationMinutes": 840,
      "topic": "3D",
      "level": "intermediate",
      "order": 4,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "3D-сцены, модели, материалы, освещение и камера."
      ]
    },
    {
      "id": "godot-core-5",
      "technologyId": "godot",
      "branch": "core",
      "title": "UI / мобильная разработка",
      "description": "Пользовательские интерфейсы и адаптация под мобильные платформы.",
      "lessonCount": 12,
      "durationMinutes": 600,
      "topic": "UI",
      "level": "intermediate",
      "order": 5,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Пользовательские интерфейсы и адаптация под мобильные платформы."
      ]
    },
    {
      "id": "godot-core-6",
      "technologyId": "godot",
      "branch": "core",
      "title": "ООП и архитектура",
      "description": "Классы, паттерны, структура проекта и масштабирование кода.",
      "lessonCount": 10,
      "durationMinutes": 600,
      "topic": "Программирование",
      "level": "intermediate",
      "order": 6,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Классы, паттерны, структура проекта и масштабирование кода."
      ]
    },
    {
      "id": "godot-core-7",
      "technologyId": "godot",
      "branch": "core",
      "title": "Игровые системы и ИИ",
      "description": "Поведение врагов, диалоги, квесты и взаимодействия.",
      "lessonCount": 14,
      "durationMinutes": 720,
      "topic": "ИИ",
      "level": "intermediate",
      "order": 7,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Поведение врагов, диалоги, квесты и взаимодействия."
      ]
    },
    {
      "id": "godot-core-8",
      "technologyId": "godot",
      "branch": "core",
      "title": "Шейдеры / VFX / звук",
      "description": "Визуальные эффекты, шейдеры, частицы и игровое аудио.",
      "lessonCount": 12,
      "durationMinutes": 600,
      "topic": "Эффекты",
      "level": "intermediate",
      "order": 8,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Визуальные эффекты, шейдеры, частицы и игровое аудио."
      ]
    },
    {
      "id": "godot-core-9",
      "technologyId": "godot",
      "branch": "core",
      "title": "Мультиплеер",
      "description": "Сетевые игры, синхронизация, лобби и оптимизация сети.",
      "lessonCount": 12,
      "durationMinutes": 720,
      "topic": "Сеть",
      "level": "advanced",
      "order": 9,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Сетевые игры, синхронизация, лобби и оптимизация сети."
      ]
    },
    {
      "id": "godot-core-10",
      "technologyId": "godot",
      "branch": "core",
      "title": "Тестирование / оптимизация",
      "description": "Отладка, профилирование и измерение производительности.",
      "lessonCount": 10,
      "durationMinutes": 480,
      "topic": "Оптимизация",
      "level": "advanced",
      "order": 10,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Отладка, профилирование и измерение производительности."
      ]
    },
    {
      "id": "godot-core-11",
      "technologyId": "godot",
      "branch": "core",
      "title": "Инструменты / плагины",
      "description": "Расширения редактора и собственные инструменты разработки.",
      "lessonCount": 10,
      "durationMinutes": 480,
      "topic": "Инструменты",
      "level": "advanced",
      "order": 11,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Расширения редактора и собственные инструменты разработки."
      ]
    },
    {
      "id": "godot-core-12",
      "technologyId": "godot",
      "branch": "core",
      "title": "Публикация / монетизация",
      "description": "Сборка, экспорт и подготовка страницы игры к релизу.",
      "lessonCount": 8,
      "durationMinutes": 480,
      "topic": "Релиз",
      "level": "advanced",
      "order": 12,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Сборка, экспорт и подготовка страницы игры к релизу."
      ]
    },
    {
      "id": "godot-core-13",
      "capstone": true,
      "technologyId": "godot",
      "branch": "core",
      "title": "Дипломный проект",
      "description": "Соберите собственную игру, применив знания всего пути обучения.",
      "lessonCount": 8,
      "durationMinutes": 960,
      "topic": "Проект",
      "level": "advanced",
      "order": 13,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Соберите собственную игру, применив знания всего пути обучения."
      ]
    },
    {
      "id": "godot-applied-1",
      "technologyId": "godot",
      "branch": "applied",
      "title": "Платформер на Godot",
      "description": "Соберите 2D-платформер: прыжки, враги, уровни и сбор предметов.",
      "lessonCount": 12,
      "durationMinutes": 200,
      "topic": "2D",
      "level": "intermediate",
      "order": 1,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Соберите 2D-платформер: прыжки, враги, уровни и сбор предметов."
      ]
    },
    {
      "id": "godot-applied-2",
      "technologyId": "godot",
      "branch": "applied",
      "title": "Инвентарь",
      "description": "Система предметов, слотов, экипировки и использования предметов.",
      "lessonCount": 8,
      "durationMinutes": 135,
      "topic": "UI",
      "level": "intermediate",
      "order": 2,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Система предметов, слотов, экипировки и использования предметов."
      ]
    },
    {
      "id": "godot-applied-3",
      "technologyId": "godot",
      "branch": "applied",
      "title": "Диалоги и квесты",
      "description": "Ветвящиеся разговоры и система квестов с условиями и наградами.",
      "lessonCount": 10,
      "durationMinutes": 170,
      "topic": "Сюжет",
      "level": "intermediate",
      "order": 3,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Ветвящиеся разговоры и система квестов с условиями и наградами."
      ]
    },
    {
      "id": "godot-applied-4",
      "technologyId": "godot",
      "branch": "applied",
      "title": "Топ-даун RPG",
      "description": "Перемещение, взаимодействия, NPC и простая боевая система.",
      "lessonCount": 14,
      "durationMinutes": 250,
      "topic": "RPG",
      "level": "intermediate",
      "order": 4,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Перемещение, взаимодействия, NPC и простая боевая система."
      ]
    },
    {
      "id": "godot-applied-5",
      "technologyId": "godot",
      "branch": "applied",
      "title": "Сохранения",
      "description": "Сохранение и загрузка прогресса, настроек и игровых данных.",
      "lessonCount": 6,
      "durationMinutes": 100,
      "topic": "Системы",
      "level": "intermediate",
      "order": 5,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Сохранение и загрузка прогресса, настроек и игровых данных."
      ]
    },
    {
      "id": "godot-applied-6",
      "technologyId": "godot",
      "branch": "applied",
      "title": "Меню и настройки",
      "description": "Главное меню, настройки графики, звука и управления.",
      "lessonCount": 8,
      "durationMinutes": 130,
      "topic": "UI",
      "level": "intermediate",
      "order": 6,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Главное меню, настройки графики, звука и управления."
      ]
    },
    {
      "id": "godot-applied-7",
      "technologyId": "godot",
      "branch": "applied",
      "title": "HUD и интерфейс",
      "description": "Полосы здоровья, инвентарь, мини-карта и счётчики ресурсов.",
      "lessonCount": 9,
      "durationMinutes": 145,
      "topic": "UI",
      "level": "intermediate",
      "order": 7,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Полосы здоровья, инвентарь, мини-карта и счётчики ресурсов."
      ]
    },
    {
      "id": "godot-applied-8",
      "technologyId": "godot",
      "branch": "applied",
      "title": "2D бой и враги",
      "description": "Ближний бой, урон, анимации и эффекты попаданий.",
      "lessonCount": 11,
      "durationMinutes": 185,
      "topic": "Бой",
      "level": "intermediate",
      "order": 8,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Ближний бой, урон, анимации и эффекты попаданий."
      ]
    },
    {
      "id": "godot-applied-9",
      "technologyId": "godot",
      "branch": "applied",
      "title": "Мобильный UI",
      "description": "Виртуальный джойстик, жесты и адаптация интерфейса.",
      "lessonCount": 7,
      "durationMinutes": 110,
      "topic": "Мобильные игры",
      "level": "intermediate",
      "order": 9,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Виртуальный джойстик, жесты и адаптация интерфейса."
      ]
    },
    {
      "id": "godot-applied-10",
      "technologyId": "godot",
      "branch": "applied",
      "title": "Экспорт на Android",
      "description": "Настройка экспорта, разрешения, иконки и тестирование.",
      "lessonCount": 6,
      "durationMinutes": 90,
      "topic": "Релиз",
      "level": "intermediate",
      "order": 10,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Настройка экспорта, разрешения, иконки и тестирование."
      ]
    },
    {
      "id": "godot-applied-11",
      "technologyId": "godot",
      "branch": "applied",
      "title": "Продвинутый ИИ",
      "description": "Патрулирование, зоны внимания и поиск игрока.",
      "lessonCount": 10,
      "durationMinutes": 160,
      "topic": "ИИ",
      "level": "intermediate",
      "order": 11,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Патрулирование, зоны внимания и поиск игрока."
      ]
    },
    {
      "id": "godot-applied-12",
      "technologyId": "godot",
      "branch": "applied",
      "title": "Процедурные уровни",
      "description": "Комнаты, коридоры и размещение врагов и предметов.",
      "lessonCount": 8,
      "durationMinutes": 140,
      "topic": "Генерация",
      "level": "intermediate",
      "order": 12,
      "published": true,
      "image": "assets/mastery/godot.svg",
      "url": "",
      "outcomes": [
        "Комнаты, коридоры и размещение врагов и предметов."
      ]
    },
    {
      "id": "gamemaker-core-1",
      "technologyId": "gamemaker",
      "branch": "core",
      "title": "Интерфейс и первые объекты",
      "description": "События, комнаты и спрайты",
      "lessonCount": 8,
      "durationMinutes": 180,
      "topic": "Основы",
      "level": "beginner",
      "order": 1,
      "published": true,
      "image": "assets/mastery/gamemaker.svg",
      "url": "",
      "outcomes": [
        "События, комнаты и спрайты"
      ]
    },
    {
      "id": "gamemaker-core-2",
      "technologyId": "gamemaker",
      "branch": "core",
      "title": "GML: основы языка",
      "description": "Переменные, функции и события",
      "lessonCount": 9,
      "durationMinutes": 240,
      "topic": "Практика",
      "level": "beginner",
      "order": 2,
      "published": true,
      "image": "assets/mastery/gamemaker.svg",
      "url": "",
      "outcomes": [
        "Переменные, функции и события"
      ]
    },
    {
      "id": "gamemaker-core-3",
      "technologyId": "gamemaker",
      "branch": "core",
      "title": "Системы 2D-игры",
      "description": "Коллизии, камера и управление",
      "lessonCount": 10,
      "durationMinutes": 300,
      "topic": "Практика",
      "level": "intermediate",
      "order": 3,
      "published": true,
      "image": "assets/mastery/gamemaker.svg",
      "url": "",
      "outcomes": [
        "Коллизии, камера и управление"
      ]
    },
    {
      "id": "gamemaker-applied-1",
      "technologyId": "gamemaker",
      "branch": "applied",
      "title": "Аркада с нуля",
      "description": "Игрок, противники и подсчёт очков",
      "lessonCount": 11,
      "durationMinutes": 360,
      "topic": "Практика",
      "level": "intermediate",
      "order": 1,
      "published": true,
      "image": "assets/mastery/gamemaker.svg",
      "url": "",
      "outcomes": [
        "Игрок, противники и подсчёт очков"
      ]
    },
    {
      "id": "gamemaker-applied-2",
      "technologyId": "gamemaker",
      "branch": "applied",
      "title": "Платформер на GML",
      "description": "Движение, прыжки и уровни",
      "lessonCount": 12,
      "durationMinutes": 420,
      "topic": "Практика",
      "level": "intermediate",
      "order": 2,
      "published": true,
      "image": "assets/mastery/gamemaker.svg",
      "url": "",
      "outcomes": [
        "Движение, прыжки и уровни"
      ]
    },
    {
      "id": "rpgmaker-core-1",
      "technologyId": "rpgmaker",
      "branch": "core",
      "title": "Первые шаги в RPG Maker",
      "description": "Редактор, карты и персонажи",
      "lessonCount": 8,
      "durationMinutes": 180,
      "topic": "Основы",
      "level": "beginner",
      "order": 1,
      "published": true,
      "image": "assets/mastery/rpgmaker.svg",
      "url": "",
      "outcomes": [
        "Редактор, карты и персонажи"
      ]
    },
    {
      "id": "rpgmaker-core-2",
      "technologyId": "rpgmaker",
      "branch": "core",
      "title": "События и переменные",
      "description": "Условия, переключатели и логика событий",
      "lessonCount": 9,
      "durationMinutes": 240,
      "topic": "Практика",
      "level": "beginner",
      "order": 2,
      "published": true,
      "image": "assets/mastery/rpgmaker.svg",
      "url": "",
      "outcomes": [
        "Условия, переключатели и логика событий"
      ]
    },
    {
      "id": "rpgmaker-core-3",
      "technologyId": "rpgmaker",
      "branch": "core",
      "title": "Мир и история",
      "description": "Диалоги, прогрессия и структура мира",
      "lessonCount": 10,
      "durationMinutes": 300,
      "topic": "Практика",
      "level": "intermediate",
      "order": 3,
      "published": true,
      "image": "assets/mastery/rpgmaker.svg",
      "url": "",
      "outcomes": [
        "Диалоги, прогрессия и структура мира"
      ]
    },
    {
      "id": "rpgmaker-applied-1",
      "technologyId": "rpgmaker",
      "branch": "applied",
      "title": "Первая история",
      "description": "Небольшое приключение с началом и финалом",
      "lessonCount": 11,
      "durationMinutes": 360,
      "topic": "Практика",
      "level": "intermediate",
      "order": 1,
      "published": true,
      "image": "assets/mastery/rpgmaker.svg",
      "url": "",
      "outcomes": [
        "Небольшое приключение с началом и финалом"
      ]
    },
    {
      "id": "rpgmaker-applied-2",
      "technologyId": "rpgmaker",
      "branch": "applied",
      "title": "Квестовая система",
      "description": "Задания, награды и состояние мира",
      "lessonCount": 12,
      "durationMinutes": 420,
      "topic": "Практика",
      "level": "intermediate",
      "order": 2,
      "published": true,
      "image": "assets/mastery/rpgmaker.svg",
      "url": "",
      "outcomes": [
        "Задания, награды и состояние мира"
      ]
    },
    {
      "id": "blender-core-1",
      "technologyId": "blender",
      "branch": "core",
      "title": "Blender с нуля",
      "description": "Интерфейс, навигация и работа с объектами",
      "lessonCount": 8,
      "durationMinutes": 180,
      "topic": "Основы",
      "level": "beginner",
      "order": 1,
      "published": true,
      "image": "assets/mastery/blender.svg",
      "url": "",
      "outcomes": [
        "Интерфейс, навигация и работа с объектами"
      ]
    },
    {
      "id": "blender-core-2",
      "technologyId": "blender",
      "branch": "core",
      "title": "Моделирование для игр",
      "description": "Геометрия, модификаторы и UV-развёртка",
      "lessonCount": 9,
      "durationMinutes": 240,
      "topic": "Практика",
      "level": "beginner",
      "order": 2,
      "published": true,
      "image": "assets/mastery/blender.svg",
      "url": "",
      "outcomes": [
        "Геометрия, модификаторы и UV-развёртка"
      ]
    },
    {
      "id": "blender-core-3",
      "technologyId": "blender",
      "branch": "core",
      "title": "Материалы и анимация",
      "description": "Текстуры, свет и ключевые кадры",
      "lessonCount": 10,
      "durationMinutes": 300,
      "topic": "Практика",
      "level": "intermediate",
      "order": 3,
      "published": true,
      "image": "assets/mastery/blender.svg",
      "url": "",
      "outcomes": [
        "Текстуры, свет и ключевые кадры"
      ]
    },
    {
      "id": "blender-applied-1",
      "technologyId": "blender",
      "branch": "applied",
      "title": "Low-poly окружение",
      "description": "Создайте игровой остров и экспортируйте ассеты",
      "lessonCount": 11,
      "durationMinutes": 360,
      "topic": "Практика",
      "level": "intermediate",
      "order": 1,
      "published": true,
      "image": "assets/mastery/blender.svg",
      "url": "",
      "outcomes": [
        "Создайте игровой остров и экспортируйте ассеты"
      ]
    },
    {
      "id": "blender-applied-2",
      "technologyId": "blender",
      "branch": "applied",
      "title": "Персонаж для игры",
      "description": "Модель, риг и базовая анимация",
      "lessonCount": 12,
      "durationMinutes": 420,
      "topic": "Практика",
      "level": "intermediate",
      "order": 2,
      "published": true,
      "image": "assets/mastery/blender.svg",
      "url": "",
      "outcomes": [
        "Модель, риг и базовая анимация"
      ]
    },
    {
      "id": "aseprite-core-1",
      "technologyId": "aseprite",
      "branch": "core",
      "title": "Aseprite с нуля",
      "description": "Инструменты, слои, палитра и экспорт",
      "lessonCount": 8,
      "durationMinutes": 180,
      "topic": "Основы",
      "level": "beginner",
      "order": 1,
      "published": true,
      "image": "assets/mastery/aseprite.svg",
      "url": "",
      "outcomes": [
        "Инструменты, слои, палитра и экспорт"
      ]
    },
    {
      "id": "aseprite-core-2",
      "technologyId": "aseprite",
      "branch": "core",
      "title": "Спрайты и тайлсеты",
      "description": "Сетка, читаемость, бесшовность и игровые ассеты",
      "lessonCount": 9,
      "durationMinutes": 240,
      "topic": "Практика",
      "level": "beginner",
      "order": 2,
      "published": true,
      "image": "assets/mastery/aseprite.svg",
      "url": "",
      "outcomes": [
        "Сетка, читаемость, бесшовность и игровые ассеты"
      ]
    },
    {
      "id": "aseprite-core-3",
      "technologyId": "aseprite",
      "branch": "core",
      "title": "Покадровая анимация",
      "description": "Тайминг, ключевые позы и циклы движения",
      "lessonCount": 10,
      "durationMinutes": 300,
      "topic": "Практика",
      "level": "intermediate",
      "order": 3,
      "published": true,
      "image": "assets/mastery/aseprite.svg",
      "url": "",
      "outcomes": [
        "Тайминг, ключевые позы и циклы движения"
      ]
    },
    {
      "id": "aseprite-applied-1",
      "technologyId": "aseprite",
      "branch": "applied",
      "title": "Анимированный персонаж",
      "description": "Нарисуйте героя и набор игровых анимаций",
      "lessonCount": 11,
      "durationMinutes": 360,
      "topic": "Практика",
      "level": "intermediate",
      "order": 1,
      "published": true,
      "image": "assets/mastery/aseprite.svg",
      "url": "",
      "outcomes": [
        "Нарисуйте героя и набор игровых анимаций"
      ]
    },
    {
      "id": "aseprite-applied-2",
      "technologyId": "aseprite",
      "branch": "applied",
      "title": "Тайлсет для платформера",
      "description": "Платформы, переходы и детали окружения",
      "lessonCount": 12,
      "durationMinutes": 420,
      "topic": "Практика",
      "level": "intermediate",
      "order": 2,
      "published": true,
      "image": "assets/mastery/aseprite.svg",
      "url": "",
      "outcomes": [
        "Платформы, переходы и детали окружения"
      ]
    },
    {
      "id": "unity-core-1",
      "technologyId": "unity",
      "branch": "core",
      "title": "Unity с нуля",
      "description": "Редактор, сцены, объекты и компоненты",
      "lessonCount": 8,
      "durationMinutes": 180,
      "topic": "Основы",
      "level": "beginner",
      "order": 1,
      "published": true,
      "image": "assets/mastery/unity.svg",
      "url": "",
      "outcomes": [
        "Редактор, сцены, объекты и компоненты"
      ]
    },
    {
      "id": "unity-core-2",
      "technologyId": "unity",
      "branch": "core",
      "title": "C# в Unity",
      "description": "Скрипты, события и работа с компонентами",
      "lessonCount": 9,
      "durationMinutes": 240,
      "topic": "Практика",
      "level": "beginner",
      "order": 2,
      "published": true,
      "image": "assets/mastery/unity.svg",
      "url": "",
      "outcomes": [
        "Скрипты, события и работа с компонентами"
      ]
    },
    {
      "id": "unity-core-3",
      "technologyId": "unity",
      "branch": "core",
      "title": "2D и 3D механики",
      "description": "Физика, анимация, камера и интерфейс",
      "lessonCount": 10,
      "durationMinutes": 300,
      "topic": "Практика",
      "level": "intermediate",
      "order": 3,
      "published": true,
      "image": "assets/mastery/unity.svg",
      "url": "",
      "outcomes": [
        "Физика, анимация, камера и интерфейс"
      ]
    },
    {
      "id": "unity-applied-1",
      "technologyId": "unity",
      "branch": "applied",
      "title": "Аркада на Unity",
      "description": "Создайте и соберите небольшую игру",
      "lessonCount": 11,
      "durationMinutes": 360,
      "topic": "Практика",
      "level": "intermediate",
      "order": 1,
      "published": true,
      "image": "assets/mastery/unity.svg",
      "url": "",
      "outcomes": [
        "Создайте и соберите небольшую игру"
      ]
    },
    {
      "id": "unity-applied-2",
      "technologyId": "unity",
      "branch": "applied",
      "title": "Контроллер персонажа",
      "description": "Управление, камера и анимации",
      "lessonCount": 12,
      "durationMinutes": 420,
      "topic": "Практика",
      "level": "intermediate",
      "order": 2,
      "published": true,
      "image": "assets/mastery/unity.svg",
      "url": "",
      "outcomes": [
        "Управление, камера и анимации"
      ]
    },
    {
      "id": "web-core-1",
      "technologyId": "web",
      "branch": "core",
      "title": "HTML и CSS",
      "description": "Структура страниц, стили и адаптивная вёрстка",
      "lessonCount": 8,
      "durationMinutes": 180,
      "topic": "Основы",
      "level": "beginner",
      "order": 1,
      "published": true,
      "image": "assets/mastery/web.svg",
      "url": "",
      "outcomes": [
        "Структура страниц, стили и адаптивная вёрстка"
      ]
    },
    {
      "id": "web-core-2",
      "technologyId": "web",
      "branch": "core",
      "title": "JavaScript с нуля",
      "description": "Данные, функции, события и DOM",
      "lessonCount": 9,
      "durationMinutes": 240,
      "topic": "Практика",
      "level": "beginner",
      "order": 2,
      "published": true,
      "image": "assets/mastery/web.svg",
      "url": "",
      "outcomes": [
        "Данные, функции, события и DOM"
      ]
    },
    {
      "id": "web-core-3",
      "technologyId": "web",
      "branch": "core",
      "title": "Игры в браузере",
      "description": "Canvas, игровой цикл и взаимодействия",
      "lessonCount": 10,
      "durationMinutes": 300,
      "topic": "Практика",
      "level": "intermediate",
      "order": 3,
      "published": true,
      "image": "assets/mastery/web.svg",
      "url": "",
      "outcomes": [
        "Canvas, игровой цикл и взаимодействия"
      ]
    },
    {
      "id": "web-applied-1",
      "technologyId": "web",
      "branch": "applied",
      "title": "Игра на Canvas",
      "description": "Реализуйте механику, счёт и перезапуск",
      "lessonCount": 11,
      "durationMinutes": 360,
      "topic": "Практика",
      "level": "intermediate",
      "order": 1,
      "published": true,
      "image": "assets/mastery/web.svg",
      "url": "",
      "outcomes": [
        "Реализуйте механику, счёт и перезапуск"
      ]
    },
    {
      "id": "web-applied-2",
      "technologyId": "web",
      "branch": "applied",
      "title": "Личный сайт разработчика",
      "description": "Адаптивное портфолио собственных проектов",
      "lessonCount": 12,
      "durationMinutes": 420,
      "topic": "Практика",
      "level": "intermediate",
      "order": 2,
      "published": true,
      "image": "assets/mastery/web.svg",
      "url": "",
      "outcomes": [
        "Адаптивное портфолио собственных проектов"
      ]
    },
    {
      "id": "csharp-core-1",
      "technologyId": "csharp",
      "branch": "core",
      "title": "C# с нуля",
      "description": "Типы данных, условия, циклы и методы",
      "lessonCount": 8,
      "durationMinutes": 180,
      "topic": "Основы",
      "level": "beginner",
      "order": 1,
      "published": true,
      "image": "assets/mastery/csharp.svg",
      "url": "",
      "outcomes": [
        "Типы данных, условия, циклы и методы"
      ]
    },
    {
      "id": "csharp-core-2",
      "technologyId": "csharp",
      "branch": "core",
      "title": "Объектная модель",
      "description": "Классы, интерфейсы и композиция",
      "lessonCount": 9,
      "durationMinutes": 240,
      "topic": "Практика",
      "level": "beginner",
      "order": 2,
      "published": true,
      "image": "assets/mastery/csharp.svg",
      "url": "",
      "outcomes": [
        "Классы, интерфейсы и композиция"
      ]
    },
    {
      "id": "csharp-core-3",
      "technologyId": "csharp",
      "branch": "core",
      "title": ".NET на практике",
      "description": "Коллекции, файлы и асинхронные операции",
      "lessonCount": 10,
      "durationMinutes": 300,
      "topic": "Практика",
      "level": "intermediate",
      "order": 3,
      "published": true,
      "image": "assets/mastery/csharp.svg",
      "url": "",
      "outcomes": [
        "Коллекции, файлы и асинхронные операции"
      ]
    },
    {
      "id": "csharp-applied-1",
      "technologyId": "csharp",
      "branch": "applied",
      "title": "Редактор игровых данных",
      "description": "Инструмент для подготовки контента",
      "lessonCount": 11,
      "durationMinutes": 360,
      "topic": "Практика",
      "level": "intermediate",
      "order": 1,
      "published": true,
      "image": "assets/mastery/csharp.svg",
      "url": "",
      "outcomes": [
        "Инструмент для подготовки контента"
      ]
    },
    {
      "id": "csharp-applied-2",
      "technologyId": "csharp",
      "branch": "applied",
      "title": "Система инвентаря на C#",
      "description": "Модель предметов и независимая игровая логика",
      "lessonCount": 12,
      "durationMinutes": 420,
      "topic": "Практика",
      "level": "intermediate",
      "order": 2,
      "published": true,
      "image": "assets/mastery/csharp.svg",
      "url": "",
      "outcomes": [
        "Модель предметов и независимая игровая логика"
      ]
    },
    {
      "id": "pixelart-core-1",
      "technologyId": "pixelart",
      "branch": "core",
      "title": "Основы пиксель-арта",
      "description": "Силуэт, форма, сетка и читаемость",
      "lessonCount": 8,
      "durationMinutes": 180,
      "topic": "Основы",
      "level": "beginner",
      "order": 1,
      "published": true,
      "image": "assets/mastery/pixelart.svg",
      "url": "",
      "outcomes": [
        "Силуэт, форма, сетка и читаемость"
      ]
    },
    {
      "id": "pixelart-core-2",
      "technologyId": "pixelart",
      "branch": "core",
      "title": "Цвет и освещение",
      "description": "Палитры, тени, материалы и глубина",
      "lessonCount": 9,
      "durationMinutes": 240,
      "topic": "Практика",
      "level": "beginner",
      "order": 2,
      "published": true,
      "image": "assets/mastery/pixelart.svg",
      "url": "",
      "outcomes": [
        "Палитры, тени, материалы и глубина"
      ]
    },
    {
      "id": "pixelart-core-3",
      "technologyId": "pixelart",
      "branch": "core",
      "title": "Анимация в пикселях",
      "description": "Позы, движение и эффекты",
      "lessonCount": 10,
      "durationMinutes": 300,
      "topic": "Практика",
      "level": "intermediate",
      "order": 3,
      "published": true,
      "image": "assets/mastery/pixelart.svg",
      "url": "",
      "outcomes": [
        "Позы, движение и эффекты"
      ]
    },
    {
      "id": "pixelart-applied-1",
      "technologyId": "pixelart",
      "branch": "applied",
      "title": "Пиксельный мир",
      "description": "Набор согласованных ассетов для уровня",
      "lessonCount": 11,
      "durationMinutes": 360,
      "topic": "Практика",
      "level": "intermediate",
      "order": 1,
      "published": true,
      "image": "assets/mastery/pixelart.svg",
      "url": "",
      "outcomes": [
        "Набор согласованных ассетов для уровня"
      ]
    },
    {
      "id": "pixelart-applied-2",
      "technologyId": "pixelart",
      "branch": "applied",
      "title": "Эффекты попаданий",
      "description": "Короткие анимации искр, дыма и взрывов",
      "lessonCount": 12,
      "durationMinutes": 420,
      "topic": "Практика",
      "level": "intermediate",
      "order": 2,
      "published": true,
      "image": "assets/mastery/pixelart.svg",
      "url": "",
      "outcomes": [
        "Короткие анимации искр, дыма и взрывов"
      ]
    },
    {
      "id": "audio-core-1",
      "technologyId": "audio",
      "branch": "core",
      "title": "Звук в игре",
      "description": "Частоты, громкость, форматы и экспорт",
      "lessonCount": 8,
      "durationMinutes": 180,
      "topic": "Основы",
      "level": "beginner",
      "order": 1,
      "published": true,
      "image": "assets/mastery/audio.svg",
      "url": "",
      "outcomes": [
        "Частоты, громкость, форматы и экспорт"
      ]
    },
    {
      "id": "audio-core-2",
      "technologyId": "audio",
      "branch": "core",
      "title": "Основы игровой музыки",
      "description": "Ритм, гармония и зацикливание",
      "lessonCount": 9,
      "durationMinutes": 240,
      "topic": "Практика",
      "level": "beginner",
      "order": 2,
      "published": true,
      "image": "assets/mastery/audio.svg",
      "url": "",
      "outcomes": [
        "Ритм, гармония и зацикливание"
      ]
    },
    {
      "id": "audio-core-3",
      "technologyId": "audio",
      "branch": "core",
      "title": "Интерактивное аудио",
      "description": "Слои, переходы и адаптивный звук",
      "lessonCount": 10,
      "durationMinutes": 300,
      "topic": "Практика",
      "level": "intermediate",
      "order": 3,
      "published": true,
      "image": "assets/mastery/audio.svg",
      "url": "",
      "outcomes": [
        "Слои, переходы и адаптивный звук"
      ]
    },
    {
      "id": "audio-applied-1",
      "technologyId": "audio",
      "branch": "applied",
      "title": "Звуковой набор для игры",
      "description": "Шаги, действия, интерфейс и окружение",
      "lessonCount": 11,
      "durationMinutes": 360,
      "topic": "Практика",
      "level": "intermediate",
      "order": 1,
      "published": true,
      "image": "assets/mastery/audio.svg",
      "url": "",
      "outcomes": [
        "Шаги, действия, интерфейс и окружение"
      ]
    },
    {
      "id": "audio-applied-2",
      "technologyId": "audio",
      "branch": "applied",
      "title": "Музыкальная петля",
      "description": "Напишите атмосферный игровой трек",
      "lessonCount": 12,
      "durationMinutes": 420,
      "topic": "Практика",
      "level": "intermediate",
      "order": 2,
      "published": true,
      "image": "assets/mastery/audio.svg",
      "url": "",
      "outcomes": [
        "Напишите атмосферный игровой трек"
      ]
    },
    {
      "id": "tools-core-1",
      "technologyId": "tools",
      "branch": "core",
      "title": "Git для разработчика",
      "description": "Коммиты, ветки и история проекта",
      "lessonCount": 8,
      "durationMinutes": 180,
      "topic": "Основы",
      "level": "beginner",
      "order": 1,
      "published": true,
      "image": "assets/mastery/tools.svg",
      "url": "",
      "outcomes": [
        "Коммиты, ветки и история проекта"
      ]
    },
    {
      "id": "tools-core-2",
      "technologyId": "tools",
      "branch": "core",
      "title": "Рабочий процесс",
      "description": "Планирование, задачи и организация ассетов",
      "lessonCount": 9,
      "durationMinutes": 240,
      "topic": "Практика",
      "level": "beginner",
      "order": 2,
      "published": true,
      "image": "assets/mastery/tools.svg",
      "url": "",
      "outcomes": [
        "Планирование, задачи и организация ассетов"
      ]
    },
    {
      "id": "tools-core-3",
      "technologyId": "tools",
      "branch": "core",
      "title": "Сборка и автоматизация",
      "description": "Повторяемая подготовка проекта к релизу",
      "lessonCount": 10,
      "durationMinutes": 300,
      "topic": "Практика",
      "level": "intermediate",
      "order": 3,
      "published": true,
      "image": "assets/mastery/tools.svg",
      "url": "",
      "outcomes": [
        "Повторяемая подготовка проекта к релизу"
      ]
    },
    {
      "id": "tools-applied-1",
      "technologyId": "tools",
      "branch": "applied",
      "title": "Пайплайн инди-команды",
      "description": "Согласуйте код, графику и задачи",
      "lessonCount": 11,
      "durationMinutes": 360,
      "topic": "Практика",
      "level": "intermediate",
      "order": 1,
      "published": true,
      "image": "assets/mastery/tools.svg",
      "url": "",
      "outcomes": [
        "Согласуйте код, графику и задачи"
      ]
    },
    {
      "id": "tools-applied-2",
      "technologyId": "tools",
      "branch": "applied",
      "title": "Автоматическая сборка",
      "description": "Настройте проверки и создание билдов",
      "lessonCount": 12,
      "durationMinutes": 420,
      "topic": "Практика",
      "level": "intermediate",
      "order": 2,
      "published": true,
      "image": "assets/mastery/tools.svg",
      "url": "",
      "outcomes": [
        "Настройте проверки и создание билдов"
      ]
    },
    {
      "id": "design-core-1",
      "technologyId": "design",
      "branch": "core",
      "title": "Основы геймдизайна",
      "description": "Цель, действия игрока и игровой цикл",
      "lessonCount": 8,
      "durationMinutes": 180,
      "topic": "Основы",
      "level": "beginner",
      "order": 1,
      "published": true,
      "image": "assets/mastery/design.svg",
      "url": "",
      "outcomes": [
        "Цель, действия игрока и игровой цикл"
      ]
    },
    {
      "id": "design-core-2",
      "technologyId": "design",
      "branch": "core",
      "title": "Баланс и прогрессия",
      "description": "Экономика, сложность и рост возможностей",
      "lessonCount": 9,
      "durationMinutes": 240,
      "topic": "Практика",
      "level": "beginner",
      "order": 2,
      "published": true,
      "image": "assets/mastery/design.svg",
      "url": "",
      "outcomes": [
        "Экономика, сложность и рост возможностей"
      ]
    },
    {
      "id": "design-core-3",
      "technologyId": "design",
      "branch": "core",
      "title": "Дизайн уровней",
      "description": "Пространство, навигация и обучение игрока",
      "lessonCount": 10,
      "durationMinutes": 300,
      "topic": "Практика",
      "level": "intermediate",
      "order": 3,
      "published": true,
      "image": "assets/mastery/design.svg",
      "url": "",
      "outcomes": [
        "Пространство, навигация и обучение игрока"
      ]
    },
    {
      "id": "design-applied-1",
      "technologyId": "design",
      "branch": "applied",
      "title": "Прототип механики",
      "description": "Проверьте игровую идею небольшим прототипом",
      "lessonCount": 11,
      "durationMinutes": 360,
      "topic": "Практика",
      "level": "intermediate",
      "order": 1,
      "published": true,
      "image": "assets/mastery/design.svg",
      "url": "",
      "outcomes": [
        "Проверьте игровую идею небольшим прототипом"
      ]
    },
    {
      "id": "design-applied-2",
      "technologyId": "design",
      "branch": "applied",
      "title": "Дизайн игрового уровня",
      "description": "Постройте уровень и проведите плейтест",
      "lessonCount": 12,
      "durationMinutes": 420,
      "topic": "Практика",
      "level": "intermediate",
      "order": 2,
      "published": true,
      "image": "assets/mastery/design.svg",
      "url": "",
      "outcomes": [
        "Постройте уровень и проведите плейтест"
      ]
    },
    {
      "id": "ui-core-1",
      "technologyId": "ui",
      "branch": "core",
      "title": "Основы игрового UI",
      "description": "Иерархия, контраст и читаемость",
      "lessonCount": 8,
      "durationMinutes": 180,
      "topic": "Основы",
      "level": "beginner",
      "order": 1,
      "published": true,
      "image": "assets/mastery/ui.svg",
      "url": "",
      "outcomes": [
        "Иерархия, контраст и читаемость"
      ]
    },
    {
      "id": "ui-core-2",
      "technologyId": "ui",
      "branch": "core",
      "title": "Компоненты интерфейса",
      "description": "Состояния кнопок, панели и обратная связь",
      "lessonCount": 9,
      "durationMinutes": 240,
      "topic": "Практика",
      "level": "beginner",
      "order": 2,
      "published": true,
      "image": "assets/mastery/ui.svg",
      "url": "",
      "outcomes": [
        "Состояния кнопок, панели и обратная связь"
      ]
    },
    {
      "id": "ui-core-3",
      "technologyId": "ui",
      "branch": "core",
      "title": "Адаптивный интерфейс",
      "description": "Масштабирование и разные способы ввода",
      "lessonCount": 10,
      "durationMinutes": 300,
      "topic": "Практика",
      "level": "intermediate",
      "order": 3,
      "published": true,
      "image": "assets/mastery/ui.svg",
      "url": "",
      "outcomes": [
        "Масштабирование и разные способы ввода"
      ]
    },
    {
      "id": "ui-applied-1",
      "technologyId": "ui",
      "branch": "applied",
      "title": "Интерфейс инвентаря",
      "description": "Слоты, подсказки и взаимодействия",
      "lessonCount": 11,
      "durationMinutes": 360,
      "topic": "Практика",
      "level": "intermediate",
      "order": 1,
      "published": true,
      "image": "assets/mastery/ui.svg",
      "url": "",
      "outcomes": [
        "Слоты, подсказки и взаимодействия"
      ]
    },
    {
      "id": "ui-applied-2",
      "technologyId": "ui",
      "branch": "applied",
      "title": "Главное меню игры",
      "description": "Экраны, переходы и настройки",
      "lessonCount": 12,
      "durationMinutes": 420,
      "topic": "Практика",
      "level": "intermediate",
      "order": 2,
      "published": true,
      "image": "assets/mastery/ui.svg",
      "url": "",
      "outcomes": [
        "Экраны, переходы и настройки"
      ]
    }
  ]
};
