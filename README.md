# Reviews Project

Документация по запуску и продукту:

- [Mini-PRD и пошаговый план для новичка](docs/MINI_PRD_RU.md)

- [Phase 1: Core MVP (узкий scope)](docs/PHASE1_CORE_SCOPE_RU.md)

- [Site-first roadmap: сначала дизайн, потом интеграции](docs/SITE_FIRST_ROADMAP_RU.md)

- [Landing blueprint: структура и тексты лендинга](docs/LANDING_BLUEPRINT_RU.md)


## Запуск первого прототипа сайта

### Локально

```bash
python3 -m http.server 4173
```

После запуска откройте:
- `http://localhost:4173/` — лендинг
- `http://localhost:4173/dashboard.html` — демо-кабинет
- `http://localhost:4173/review-demo.html` — демо review-flow

### Через GitHub Pages

В репозитории добавлен workflow `.github/workflows/deploy-pages.yml`, который публикует текущий статический сайт в GitHub Pages после `push` в ветку `main`, `master` или `work`.

Что нужно сделать:
1. Создать репозиторий на GitHub.
2. Подключить его как remote.
3. Выполнить `git push` с текущей веткой.
4. В настройках GitHub открыть `Settings -> Pages` и убедиться, что Source = `GitHub Actions`.
5. После завершения workflow сайт будет доступен по адресу вида:
   - `https://<github-username>.github.io/<repository-name>/`

Команды для подключения GitHub-репозитория:

```bash
git remote add origin https://github.com/<github-username>/<repository-name>.git
git push -u origin work
```

Если основной веткой у вас будет `main`, можно затем выполнить:

```bash
git checkout -b main
git push -u origin main
```
