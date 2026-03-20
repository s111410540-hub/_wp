# index.html 標籤與屬性說明

本文檔詳細標註 index.html 中所有 HTML 標籤及其屬性。

## 1. 根元素和文檔結構

### `<!DOCTYPE html>`
- 聲明文檔類型為 HTML5

### `<html lang="zh-TW">`
- **lang**: 指定文檔語言為繁體中文 (台灣)

## 2. 文檔頭部 `<head>`

### `<meta charset="UTF-8">`
- **charset**: 指定字符編碼為 UTF-8

### `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- **name**: "viewport" - 設置視窗屬性
- **content**: 
  - width=device-width - 寬度等於設備寬度
  - initial-scale=1.0 - 初始縮放比例為 100%

### `<title>補習班助教時間預約表單</title>`
- 頁面標題，顯示在瀏覽器標籤欄

### `<link rel="stylesheet" href="style.css">`
- **rel**: "stylesheet" - 指定關係類型為樣式表
- **href**: "style.css" - 指向外部 CSS 檔案

## 3. 主容器

### `<div class="form-container">`
- **class**: "form-container" - CSS 類別

## 4. 表單相關標籤

### `<form action="#" method="POST" enctype="multipart/form-data">`
- **action**: "#" - 表單提交的目標 (目前為空)
- **method**: "POST" - HTTP 請求方法
- **enctype**: "multipart/form-data" - 表單編碼類型，支持檔案上傳

## 5. 表單分組

### `<fieldset>`
- 無屬性，用於將相關表單元素分組
- 包含多個 `<legend>` 標題

### `<legend>`
- 無屬性，作為 fieldset 的標題

## 6. 表單控制項

### 文本輸入
```
<input type="text" id="student_id" name="student_id" placeholder="例如：S1234567" required>
```
- **type**: "text" - 輸入類型
- **id**: 元素唯一標識符
- **name**: 表單提交時的參數名稱
- **placeholder**: 提示文字
- **required**: 必填屬性 (無值)

### 電子郵件輸入
```
<input type="email" id="email" name="email" placeholder="student@example.com">
```
- **type**: "email" - 電子郵件驗證

### 日期輸入
```
<input type="date" id="book_date" name="book_date" required>
```
- **type**: "date" - 日期選擇器

### 單選按鈕 (Radio Button)
```
<input type="radio" id="grade1" name="grade" value="1" checked>
```
- **type**: "radio" - 單選按鈕
- **value**: "1" - 提交時的值
- **checked**: 預設選中 (無值)

### 檔案上傳
```
<input type="file" id="question_image" name="question_image" accept="image/png, image/jpeg, image/jpg">
```
- **type**: "file" - 檔案選擇器
- **accept**: "image/png, image/jpeg, image/jpg" - 允許的檔案類型

```
<input type="file" id="doc_file" name="doc_file" accept=".pdf, .doc, .docx" multiple>
```
- **multiple**: 允許選擇多個檔案

### 按鈕
```
<input type="reset" value="重新填寫" class="btn-reset">
<input type="submit" value="送出預約" class="btn-submit">
```
- **type**: "reset"/"submit" - 按鈕類型
- **value**: 按鈕顯示文本
- **class**: CSS 類別

## 7. 標籤元素

### `<label for="student_id">`
- **for**: 關聯的輸入元素 ID，提高可用性

## 8. 下拉選單

### `<select id="teacher_select" name="teacher" required>`
- **id**: 元素標識符
- **name**: 表單提交參數名稱
- **required**: 必填

### `<optgroup label="國文科">`
- **label**: 選項組標題

### `<option value="chi_1">`
- **value**: 選項提交時的值

```
<option value="" disabled selected>請選擇...</option>
```
- **disabled**: 禁用此選項 (無值)
- **selected**: 預設選中 (無值)

## 9. 容器和分組

### `<div class="form-group">`
- **class**: "form-group" - CSS 類別，用於樣式設置

### `<div class="radio-group">`
- **class**: "radio-group" - CSS 類別，用於單選按鈕分組

### `<div class="btn-group">`
- **class**: "btn-group" - CSS 類別，用於按鈕分組

## 10. 文本元素

### `<h2>📝 助教時間預約表單</h2>`
- 一級標題

### `<p class="hint">`
- **class**: "hint" - CSS 類別，用於提示文本

## 屬性總結表

| 屬性名稱 | 用途 | 範例 |
|---------|------|------|
| id | 元素唯一標識符 | `id="student_id"` |
| name | 表單提交時的參數名稱 | `name="student_id"` |
| type | 輸入或按鈕類型 | `type="email"` |
| value | 元素提交時的值或按鈕文本 | `value="1"` |
| class | CSS 類別 | `class="form-group"` |
| for | 關聯的表單元素 ID | `for="student_id"` |
| placeholder | 提示文字 | `placeholder="例如：S1234567"` |
| required | 必填 (布爾屬性) | `required` |
| disabled | 禁用 (布爾屬性) | `disabled` |
| checked | 預設選中 (布爾屬性) | `checked` |
| selected | 預設選中 (布爾屬性) | `selected` |
| multiple | 允許多選 (布爾屬性) | `multiple` |
| accept | 允許的檔案類型 | `accept="image/png"` |
| href | 連結目標 | `href="style.css"` |
| rel | 連結關係類型 | `rel="stylesheet"` |
| action | 表單提交目標 | `action="#"` |
| method | HTTP 請求方法 | `method="POST"` |
| enctype | 表單編碼類型 | `enctype="multipart/form-data"` |
| lang | 文檔語言 | `lang="zh-TW"` |
| charset | 字符編碼 | `charset="UTF-8"` |
| content | meta 標籤內容 | `content="width=device-width"` |
| label | 選項組或標籤文本 | `label="國文科"` |

## 筆記

- 該表單用於補習班助教時間預約
- 包含學生基本資料、預約資訊和附加檔案上傳功能
- 使用了 multipart/form-data 編碼以支持檔案上傳
