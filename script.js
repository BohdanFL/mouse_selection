const select = document.getElementById("select");
const targets = document.querySelectorAll(".target");
const selectPos = document.querySelector(".for-select")
const mousePos = document.querySelector(".for-mouse")


const getDirection = (e) => {
	if (e.pageX < select.offsetLeft && e.pageY < select.offsetTop) {
		return 2
	} else if (e.pageY < select.offsetTop) {
		return 3
	} else if (e.pageX < select.offsetLeft) {
		return 1
	}
	return 0
}

const detectCollide = (el1, el2, direction = 0, e) => {
	el1.right = el1.left + el1.offsetWidth;
	el1.bottom = el1.top + el1.offsetHeight;

	el2.right = el2.left + el2.offsetWidth;
	el2.bottom = el2.top + el2.offsetHeight;

	let detectedCollide
	switch (direction) {
		case 0:
			// bottom-right - defaul
			select.style.width = e.pageX - select.left + "px";
			select.style.height = e.pageY - select.top + "px";

			select.style.transformOrigin = '';
			select.style.transform = '';

			detectedCollide = el1.right >= el2.left &&
				el1.bottom >= el2.top &&
				el1.left <= el2.right &&
				el1.top <= el2.bottom
			break
		case 1:
			// bottom-left
			select.style.width = select.offsetLeft - e.pageX + 'px'
			select.style.height = e.pageY - select.offsetTop + 'px'

			select.style.transformOrigin = 'left center';
			select.style.transform = `translateX(-${select.offsetLeft - e.pageX}px)`;

			[el1.left, el1.right] = [e.pageX, select.offsetLeft]

			detectedCollide = el1.left <= el2.right &&
				el1.bottom >= el2.top &&
				el1.right >= el2.left &&
				el1.top <= el2.bottom
			break
		case 2:
			// top-left
			select.style.width = select.offsetLeft - e.pageX + 'px'
			select.style.height = select.offsetTop - e.pageY + 'px'

			select.style.transformOrigin = 'left top';
			select.style.transform = `translate(-${select.offsetLeft - e.pageX}px, -${select.offsetTop - e.pageY}px)`;

			[el1.top, el1.bottom, el1.left, el1.right] = [e.pageY, select.offsetTop, e.pageX, select.offsetLeft]


			detectedCollide = el1.left <= el2.right &&
				el1.top <= el2.bottom &&
				el1.right >= el2.left &&
				el1.bottom >= el2.top
			break
		default:
			// top-right
			select.style.width = e.pageX - select.offsetLeft + 'px'
			select.style.height = select.offsetTop - e.pageY + 'px'

			select.style.transformOrigin = 'top center';
			select.style.transform = `translateY(-${select.offsetTop - e.pageY}px)`;

			[el1.top, el1.bottom] = [e.pageY, select.offsetTop]

			detectedCollide = el1.right >= el2.left &&
				el1.top <= el2.bottom &&
				el1.left <= el2.right &&
				el1.bottom >= el2.top
	}
	return detectedCollide
};

const selecting = (e) => {
  	if (e.changedTouches !== undefined) {
   		e = e.changedTouches[0];
  	}
	select.left = select.offsetLeft
	select.top = select.offsetTop
	const direction = getDirection(e)

	targets.forEach(target => {
		target.left = target.offsetLeft
		target.top = target.offsetTop

		const isCollide = detectCollide(select, target, direction, e);
		target.style.backgroundColor = "#f0a08f"
		if (isCollide) {
			target.style.backgroundColor = "#0f6f80"
		}
	})
	
	mousePos.innerHTML = `
	    <h3>Mouse</h3>
	    left:_ ${e.pageX}
	    <br>
	    top:__${e.pageY}
	  `
	selectPos.innerHTML = `
	    <h3>Select</h3>
	    left:___ ${select.left}
	    <br>
	    right:__ ${select.right}
	    <br>
	    top:____ ${select.top}
	    <br>
	    bottom:_ ${select.bottom}
	  `
	  
};



const startSelect = (e) => {
  	if (e.changedTouches !== undefined) {
   		e = e.changedTouches[0];
  	}
  
	select.style.left = e.pageX + "px";
	select.style.top = e.pageY + "px";
	
	window.addEventListener("mousemove", selecting);
	window.addEventListener("touchmove", selecting)
};

const endSelect = () => {
	select.style = ''
	targets.forEach(target => {
		target.style.backgroundColor = "#f0a08f"
	})
	window.removeEventListener("mousemove", selecting);
	window.removeEventListener("touchmove", selecting)
};


window.addEventListener("mousedown", startSelect);
window.addEventListener("mouseup", endSelect);
window.addEventListener('touchstart', startSelect)
window.addEventListener('touchend', endSelect)
