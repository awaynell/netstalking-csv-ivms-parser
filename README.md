# Парсер .csv файлов из Nesca для удобного импорта в iVMS 4200 (если не работает Batch импорт)

## Установка

```sh
git clone https://github.com/awaynell/netstalking-csv-ivms-parser.git
cd netstalking-csv-ivms-parser
```

### Далее необходимо создать .env файл с путем до Nesca, папка с Nesca и с данным парсером должны лежать на одном и том же диске.

### Пример:

```env
PATH_TO_NESCA='/Nesca'
```

### После создания .env файла необходимо скачать зависимости:

```sh
yarn
```

### Запуск осуществляется через команду:

```sh
yarn start
```
