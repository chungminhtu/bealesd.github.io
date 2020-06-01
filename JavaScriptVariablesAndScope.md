# JavaScript Variables And Scope

## Variables and Scope

 Like any language JavaScript has scopes and variables.

 Variables are pretty self explanatory, they store information. However what syntax you use to declare variables will make a massive difference to how your code behaves. Lets look at *var*.

***

## Var

 *Var* is commonly is used to delcare a variables (commonly in older code bases, but sometimes in new ones). The function below declares a variable *foo* and assigns *bar* to it


```javascript
function fooBar(){
    var foo = "bar"; 
	console.log(foo); 
}

fooBar(); print bar
```

 This behaviour seems completely reasonable, the variable *foo* is declared in the function *fooBar*. It exists only in the function scope of *fooBar* and cannot be accessed outside of that scope. So what is the issue with *var*?


```javascript
for (var index = 0; index <99; index++){
	doSomeWork(index);

console.log(index); // print 98
```	

 Thats odd, you would expect an error when calling *index* outside of the for loop. Well not with *var*, it has no block scope. The same would apply with a *while, switch, if*, etc.
			
***
	
## Hoisting Var
 So *var* has no block scope, but does it do anything else exciting. Well, yes! It supports hoisting.

```javascript
function fooBar(){
	foo = "bar";
	console.log(foo);
	var foo;
}

fooBar(); //prints bar
```

 I forgot to declare *foo* using *var* before I assigned a value to it. Guess what *var* doesn't care, as long as *foo* is declared somewhere in the function, you can assign to it. If your wondering, this is called hoisting. So declarations are hostied, but what about declaration and assignment in one. Lets try it out.

```javascript
function fooBar(){	
	console.log(foo);
	var foo = "bar";
}

fooBar(); //prints undefined
```

 So what happenned. The varaible *foo* was hoisted (it was declared), but the assignment happened	after the *foo* was printed, at which point *foo* was undefined, i.e. it had no data.

 Hositing can be quite annoying. You might want to improve runtime efficiency in your application by not	creating objects that aren't required.

```javascript
var stopMyCode = true;
if (stopMyCode) {
    return;
}

var myObjectThatShouldExist = 'iExist';
```

 As you know *myObjectThatShouldExist* does exist due to hoisting, even though the return statement is called in the *if* block!

***

## Global Var

 Variables can be declared globally so they're available anywhere.

```javascript
var globalFoo = "bar";
console.log(globalFoo);//print bar
console.log(window.globalFoo);//print bar
window.console.log(window.globalFoo);//print bar
console.log(this.globalFoo);//print bar
```

 When using *var* it gets added to the global object (*window* in browser), which is also the same as *this*! As a side note, *window* is also where most browser functionality sits, hence the confusing *window.console.log*!	

***

## Var Idiosyncrasies
 There are plenty of examples of unexpected *var* behaviour, commonly encountered in *for* loops.

```javascript
var arr = [];
for (var i=0; i < 3; i++) {
    arr.push(() => i);
}

console.log(arr.map(x => x())); // prints [3,3,3]
```

 What happenned, why wasn't *i* incremented! This is because *i* is bound to the same value outside of the annoymous function, therefore it only takes the last value that *i* was assigned to. So what is the solution?

```javascript
let arr = [];
for (let i=0; i < 3; i++) {
    arr.push(() => i);
}

console.log(arr.map(x => x())); // [0,1,2]
```

 That seemed easy, lets have a quick peek at*let*.

***

## Let and Const

 In 2015 ECMA6 was released (JavaScript 6). It introduced *let* and *const*, amongst other things. You may have guessed but *let* and *const* are the alternative to *var*. As we know *var* has no block scope. Get ready for this, *let* allows you to declare a variable with block scope. *Const* also allows you to do the same, but the value assigned is a constant.

```javascript
var x = 99; // x is 99
{ 
  let x = 9;  // x is 9
}
console.log(x); //x is 99
```

 *Let* is used to declare and assign *x* in its own scope (defined by curly braces). It does not affect the outer scope.

```javascript
var x = 99; // Here x is 99
{ 
  const x = 9;  // Here x is 9
}
console.log(x); //x is still 99
```

 This time we're using *const* instead of *let*, which make no difference in this case, unless...

```javascript
var x = 99; // Here x is 99
{ 
  const x = 9;  // Here x is 9
  x += 1; // TypeError: Assignment to constant variable.
}
```

 *Const* *x* is declared and assigned in the inner scope. It is then incremented by 1, but this fails. As a *const* is a constant value, trying to change it will throw an error.

***

## Conclusion

 If you want block scope for the variables you declare and assign to, which you probably would, use *let* or *const*. If you work with Javascript, you will come accross *var*, so make sure you understand it.
