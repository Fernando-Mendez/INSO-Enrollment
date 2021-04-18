console.log("hi")


// How to convert an Object {} to an Array [] of key-value pairs in JavaScript?
var obj = { "1": 5, "2": 7, "3": 0, "4": 0, "5": 0 };
    
// Using Object.keys() and map() function
// to convert convert an Object {} to an 
// Array [] of key-value pairs

var result = Object.keys(obj).map(function (key) {
        
    // Using Number() to convert key to number type
    // Using obj[key] to retrieve key value
    return [Number(key), obj[key]];

});
      
