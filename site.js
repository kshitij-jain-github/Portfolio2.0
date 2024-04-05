/*          *     .        *  .    *    *   . 
 .  *  move your mouse to over the stars   .
 *  .  .   change these values:   .  *
   .      * .        .          * .       */
   const STAR_COLOR = '#fff';
   const STAR_SIZE = 2;
   const STAR_MIN_SCALE = 0.1;
   const OVERFLOW_THRESHOLD = 50;
   const STAR_COUNT = ( window.innerWidth + window.innerHeight ) / 2;
   
   const canvas = document.querySelector( 'canvas' ),
         context = canvas.getContext( '2d' );
   
   let scale = 1, // device pixel ratio
       width,
       height;
   
   let stars = [];
   
   let pointerX,
       pointerY;
   
   let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0001 };
   
   let touchInput = false;
   
   generate();
   resize();
   step();
   
   window.onresize = resize;
   canvas.onmousemove = onMouseMove;
   canvas.ontouchmove = onTouchMove;
   canvas.ontouchend = onMouseLeave;
   document.onmouseleave = onMouseLeave;
   
   function generate() {
   
      for( let i = 0; i < STAR_COUNT; i++ ) {
       stars.push({
         x: 0,
         y: 0,
         z: STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE )
       });
      }
   
   }
   
   function placeStar( star ) {
   
     star.x = Math.random() * width;
     star.y = Math.random() * height;
   
   }
   
   function recycleStar( star ) {
   
     let direction = 'z';
   
     let vx = Math.abs( velocity.x ),
         vy = Math.abs( velocity.y );
   
     if( vx > 1 || vy > 1 ) {
       let axis;
   
       if( vx > vy ) {
         axis = Math.random() < vx / ( vx + vy ) ? 'h' : 'v';
       }
       else {
         axis = Math.random() < vy / ( vx + vy ) ? 'v' : 'h';
       }
   
       if( axis === 'h' ) {
         direction = velocity.x > 0 ? 'l' : 'r';
       }
       else {
         direction = velocity.y > 0 ? 't' : 'b';
       }
     }
     
     star.z = STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE );
   
     if( direction === 'z' ) {
       star.z = 0.1;
       star.x = Math.random() * width;
       star.y = Math.random() * height;
     }
     else if( direction === 'l' ) {
       star.x = -OVERFLOW_THRESHOLD;
       star.y = height * Math.random();
     }
     else if( direction === 'r' ) {
       star.x = width + OVERFLOW_THRESHOLD;
       star.y = height * Math.random();
     }
     else if( direction === 't' ) {
       star.x = width * Math.random();
       star.y = -OVERFLOW_THRESHOLD;
     }
     else if( direction === 'b' ) {
       star.x = width * Math.random();
       star.y = height + OVERFLOW_THRESHOLD;
     }
   
   }
   
   function resize() {
   
     scale = window.devicePixelRatio || 1;
   
     width = window.innerWidth * scale;
     height = window.innerHeight * scale;
   
     canvas.width = width;
     canvas.height = height;
   
     stars.forEach( placeStar );
   
   }
   
   function step() {
   
     context.clearRect( 0, 0, width, height );
   
     update();
     render();
   
     requestAnimationFrame( step );
   
   }
   
   function update() {
   
     velocity.tx *= 0.4;
     velocity.ty *= 0.4;
   
     velocity.x += ( velocity.tx - velocity.x ) * 0.1;
     velocity.y += ( velocity.ty - velocity.y ) * 0.1;
   
     stars.forEach( ( star ) => {
   
       star.x += velocity.x * star.z;
       star.y += velocity.y * star.z;
   
       star.x += ( star.x - width/2 ) * velocity.z * star.z;
       star.y += ( star.y - height/2 ) * velocity.z * star.z;
       star.z += velocity.z;
     
       // recycle when out of bounds
       if( star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD ) {
         recycleStar( star );
       }
   
     } );
   
   }
   
   function render() {
   
     stars.forEach( ( star ) => {
   
       context.beginPath();
       context.lineCap = 'round';
       context.lineWidth = STAR_SIZE * star.z * scale;
       context.globalAlpha = 0.5 + 0.5*Math.random();
       context.strokeStyle = STAR_COLOR;
   
       context.beginPath();
       context.moveTo( star.x, star.y );
   
       var tailX = velocity.x * 2,
           tailY = velocity.y * 2;
   
       // stroke() wont work on an invisible line
       if( Math.abs( tailX ) < 0.1 ) tailX = 0.5;
       if( Math.abs( tailY ) < 0.1 ) tailY = 0.5;
   
       context.lineTo( star.x + tailX, star.y + tailY );
   
       context.stroke();
   
     } );
   
   }
   
   function movePointer( x, y ) {
   
     if( typeof pointerX === 'number' && typeof pointerY === 'number' ) {
   
       let ox = x - pointerX,
           oy = y - pointerY;
   
       velocity.tx = velocity.tx + ( ox / 8*scale ) * ( touchInput ? 1 : -1 );
       velocity.ty = velocity.ty + ( oy / 8*scale ) * ( touchInput ? 1 : -1 );
   
     }
   
     pointerX = x;
     pointerY = y;
   
   }
   
   function onMouseMove( event ) {
   
     touchInput = false;
   
     movePointer( event.clientX, event.clientY );
   
   }
   
   function onTouchMove( event ) {
   
     touchInput = true;
   
     movePointer( event.touches[0].clientX, event.touches[0].clientY, true );
   
     event.preventDefault();
   
   }
   
   function onMouseLeave() {
   
     pointerX = null;
     pointerY = null;
   
   }
      

// image slider
   

   const slider = document.querySelector('.slider');

   function activate(e) {
     const items = document.querySelectorAll('.item');
     e.target.matches('.next') && slider.append(items[0])
     e.target.matches('.prev') && slider.prepend(items[items.length-1]);
   }
   
   document.addEventListener('click',activate,false);






/*!
 * CLI
 * Simulating a command line interface with vanilla JS
 *
 * @version : 1.2.0
 * @author : Paulo Nunes (http://syndicatefx.com)
 * @demo : https://codepen.io/syndicatefx/pen/jPxXpz
 * @license: MIT
 */

/*
Modified/adapted from the original script by:
https://github.com/ckm100/typeWriter.js
*/
document.addEventListener("DOMContentLoad", typeWriter, false);

var typeWriter = function (selector, type, interval) {

    var el = document.querySelectorAll(selector), // Getting elements in the DOM
        i = 0,
        len = el.length, // Length of element on the page
        list = [], // List of elements on the page in the DOM
        a,
        all,
        text,
        start,
        end,
        nextText,
        sectionId = selector.replace(/^#/, ''),
        targetSection = document.getElementById(sectionId),
        sections = document.getElementsByTagName("section")[0],
        targetSiblings = [].slice.call(sections.parentNode.children).filter(function(v) { return v !== targetSection }),
        cmd = document.querySelector(".command"),
        clear;

    for (; i < len; i++) {

        list.push(el[i]); // Pushing the element in the list array
    }

    for (a in list) {

        all = list[a]; // List of all element
        text = all.innerHTML; // InnerHTML of the elements 
        start = 0; // Start index of the text in the elements 
        end = 0; // End index of the text in the elements


        //Setting the default interval to 100 when interval is not set by the user
        if (typeof interval === "undefined") {

            interval = 100;

        }

        if (arguments[1] === "true") {

        	setTimeout(function() {
        		targetSection.classList.add("open");
        	}, 200);

	       	for(var i = 0;i < targetSiblings.length;i++) {
	        	targetSiblings[i].classList.remove("open");
	        }

            clear = setInterval(function () { // Animation start
                var newText = text.substr(start, end);

                all.innerHTML = newText;

                end = end + 1; //loops through the text in the element

                if (newText === text) {

                    clearInterval(clear); // Animation end
                    cmd.classList.add("open");
                    input.focus();

                }

            }, interval);

        }

        return all;

    }

}

var input = document.querySelector("input"),
	block = document.getElementsByTagName("section");

window.onload = function() {
	typeWriter("#home","true",10);

	var sectionArray = [];
	for(var i = 0;i < block.length;i++) {
		sectionArray.push(block[i].id);
	}
	//console.log(sectionArray);

	input.addEventListener('keyup', function(e) {
		if((e.keyCode || e.which) == 13) {// ENTER key pressed
			var targetValue = input.value;
			var destination = "#" + targetValue;
			typeWriter(destination,"true",10);
			input.value = "";

			if(sectionArray.includes(targetValue) == false) {
				typeWriter("#error","true",10);
			}
		}
	});
};
   
// var myVar;

// function myFunction() {
//   myVar = setTimeout(showPage, 1000);   // LOADER TIME 
// }

// function showPage() {
//   document.getElementById("loader").style.display = "none";
//   document.getElementById("myDiv").style.display = "block";
// }