## type:module 용 jest 환경 세팅
// 바벨을 써서 실행시에 commonJS로 바꿔주는 방법도 있는데, 여기선 jest에서 제공하는 환경 변수를 사용하는 방법을 이용한다
// https://study-ihl.tistory.com/191
// 
// 환경 설정을 위한 cross-env
```json 
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
  },
```

// babel을 쓸 일이 많아서 바벨을 설치함
```shell
npm install --save-dev babel-cli
npm install --save-dev babel-preset-es2015
npm install -D babel-jest @babel/core @babel/preset-env
```

## jsdom
jest에서는 기본적으로 node로 테스트 환경을 구축하기 때문에 HTMLElement 같은 web에만 존재하는 요소들을 알지 못한다.

따라서 jsdom을 사용하도록 설정해줘야하는데 `jest.config.js` 에서 

```js
export default {
  testEnvironment: "jsdom", // 포인트
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
```

이렇게 설정해주거나 
```js
/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});

```
이렇게 해주면 된다. 

추가적으로 
`jest-environment-jsdom` 패키지를 같이 깔았는데 이거 필요한건진 잘 모른다. 나중에 삭제하고 잘되면 문제 없는 걸로

## 크로스 오리진 에러 방지를 위한 vite 설치
npm install --save-dev vite

index.html을 폴더 최상단에 위치시키고 `vite`를 실행하면 된다

### package.json에 스크립트 추가
```json
  "scripts": {
    "dev":"vite",
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
  },

```

## template 태그를 js로 만든 뒤에 html에 추가하는 이유
html 파일에 template 내용을 유지하고 싶지 않았기 때문에 js로 만들어서 html에 추가했고
다음으로 js로 만든 template를 다른곳에서 재사용하지 않은 이유는 메모리상에 남겨놓지 않고 싶어서
따라서 html문서에 template을 추가하고 querySelector로 찾아와 사용하는 방식을 사용 
## 코드 쓰레기통

proxy 사용법
```js
    this.state = new Proxy(this.state, {
      get: function (obj, prop) {
        return obj[prop];
      },
      set: function (obj, prop, newVal) {
        obj[prop] = newVal;
        if (obj[prop] === undefined) {
          return false;
        }
        this.render();
        return true;
      }.bind(this),
    });
```

콧수염 기법 구현
```js
  const mustache = /{{\s*\w+\s*}}/g;
  let newTemplate = template.slice();
  const temp = [...template.matchAll(mustache)];
  temp.forEach((matcher) => {
    const word = matcher[0];
    const variable = word.match(/\w+/)[0];
    const value = state[variable];
    newTemplate = newTemplate.replace(word, value);
  });

  const newDOM = document.createElement("div");
  newDOM.id = "app";
  newDOM.innerHTML = newTemplate;
```

setAttribute 감시하는 방법
```js  
static get observedAttributes() {
  return [];//감시할 attribute들을 등록
}
attributeChangedCallback(name, oldValue, newValue) {
  //감시중인 attribute가 변형되었을 때 수행할 콜백
  //일종의 update 함수이지만, 업데이트 시에 화면을 리빌드하고 (render실행 x) 전달할 수 있는 value도 문자열이라 사용 안함
  //대신 dispatch와 customEvent로 값을 전달
  this.props[name] = newValue;
}

```
