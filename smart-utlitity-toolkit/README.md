# Smart Utility Toolkit

Built using only Node.js core modules (process, http, fs, crypto) — no external packages.

## How to run each part

**1. Calculator**
```
node calculator.js add 10 5
node calculator.js sub 10 5
node calculator.js mul 10 5
node calculator.js div 10 5
```

**2. Custom module reuse (isEven + logger)**
```
node app.js
```

**3. HTTP server**
```
node server.js
```
Then visit in browser: `http://localhost:8080/`, `/about`, `/contact`, or any other path (404).

**4. File manager**
```
node fileManager.js
```

**5. Dice generator**
```
node dice.js
```

## Folder structure
```
smart-utility-toolkit/
├── calculator.js
├── app.js
├── server.js
├── fileManager.js
├── dice.js
├── test.txt
├── modules/
│   ├── isEven.js
│   └── logger.js
└── README.md
```

