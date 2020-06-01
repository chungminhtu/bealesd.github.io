# JavaScript Variables And Scope

## Variables and Scope

### Like any language JavaScript has scopes and variables.

### Variables are pretty self explanatory, they store information. However what syntax you use to declare variables will make a massive difference to how your code behaves. Lets look at <em>var</em>.

## Var

### <em>Var</em> is commonly is used to delcare a variables (commonly in older code bases, but sometimes in new ones). The function below declares a variable <em>foo</em> and assigns <em>bar</em> to it

```javascript
function fooBar(){
    var foo = "bar"; 
	console.log(foo); 
}

fooBar(); print bar
```

### This behaviour seems completely reasonable, the variable <em>foo</em> is declared in the function <em>fooBar</em>. It exists only in the function scope of <em>fooBar</em> and cannot be accessed outside of that scope. So what is the issue with <em>var</em>?


```javascript
for (var index = 0; index &#60;; 99 index++){
	doSomeWork(index);

console.log(index); // print 98
```	

### Thats odd, you would expect an error when calling <em>index</em> outside of the for loop. Well not with <em>var</em>, it has no block scope. The same would apply with a <em>while, switch, if</em>, etc.
				
## Hoisting Var
### So <em>var</em> has no block scope, but does it do anything else exciting. Well, yes! It supports hoisting.

```javascript
function fooBar(){
	foo = "bar";
	console.log(foo);
	var foo;
}

fooBar(); //prints bar
```

### I forgot to declare <em>foo</em> using <em>var</em> before I assigned a value to it. Guess what <em>var</em> doesn't care, as long as <em>foo</em> is declared somewhere in the function, you can assign to it. If your wondering, this is called hoisting. So declarations are hostied, but what about declaration and assignment in one. Lets try it out.

```javascript
function fooBar(){	
	console.log(foo);
	var foo = "bar";
}

fooBar(); //prints undefined
```

### So what happenned. The varaible <em>foo</em> was hoisted (it was declared), but the assignment happened	after the <em>foo</em> was printed, at which point <em>foo</em> was undefined, i.e. it had no data.
### Hositing can be quite annoying. You might want to improve runtime efficiency in your application by not	creating objects that aren't required.

```javascript
var stopMyCode = true;
if (stopMyCode) {
    return;
}

var myObjectThatShouldExist = 'iExist';
```

### As you know <em>myObjectThatShouldExist</em> does exist due to hoisting, even though the return statement is called in the <em>if</em> block!

## Global Var

### Variables can be declared globally so they're available anywhere.

```javascript
var globalFoo = "bar";
console.log(globalFoo);//print bar
console.log(window.globalFoo);//print bar
window.console.log(window.globalFoo);//print bar
console.log(this.globalFoo);//print bar
```

### When using <em>var</em> it gets added to the global object (<em>window</em> in browser), which is also the same as <em>this</em>! As a side note, <em>window</em> is also where most browser functionality sits, hence the confusing <em>window.console.log</em>!	

## Var Idiosyncrasies
### There are plenty of examples of unexpected <em>var</em> behaviour, commonly encountered in <em>for</em> loops.

```javascript
var arr = [];
for (var i=0; i < 3; i++) {
    arr.push(() => i);
}

console.log(arr.map(x => x())); // prints [3,3,3]
```

### What happenned, why wasn't <em>i</em> incremented! This is because <em>i</em> is bound to the same value outside of the annoymous function, therefore it only takes the last value that <em>i</em> was assigned to. So what is the solution?

```javascript
let arr = [];
for (let i=0; i < 3; i++) {
    arr.push(() => i);
}

console.log(arr.map(x => x())); // [0,1,2]
```

### That seemed easy, lets have a quick peek at<em>let</em>.

## Let and Const

### In 2015 ECMA6 was released (JavaScript 6). It introduced <em>let</em> and <em>const</em>, amongst other things. You may have guessed but <em>let</em> and <em>const</em> are the alternative to <em>var</em>. As we know <em>var</em> has no block scope. Get ready for this, <em>let</em> allows you to declare a variable with block scope. <em>Const</em> also allows you to do the same, but the value assigned is a constant.

```javascript
var x = 99; // x is 99
{ 
  let x = 9;  // x is 9
}
console.log(x); //x is 99
```

### <em>Let</em> is used to declare and assign <em>x</em> in its own scope (defined by curly braces). It does not affect the outer scope.

```javascript
var x = 99; // Here x is 99
{ 
  const x = 9;  // Here x is 9
}
console.log(x); //x is still 99
```

### This time we're using <em>const</em> instead of <em>let</em>, which make no difference in this case, unless...

```javascript
var x = 99; // Here x is 99
{ 
  const x = 9;  // Here x is 9
  x += 1; // TypeError: Assignment to constant variable.
}
```

### <em>Const</em> <em>x</em> is declared and assigned in the inner scope. It is then incremented by 1, but this fails. As a <em>const</em> is a constant value, trying to change it will throw an error.

## Conclusion

### If you want block scope for the variables you declare and assign to, which you probably would, use <em>let</em> or <em>const</em>. If you work with Javascript, you will come accross <em>var</em>, so make sure you understand it.
