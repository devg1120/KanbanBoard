import Sticky from "./Sticky.js";
import { createElementWithClasses } from "../helper.js";

// static variable to check if drop is successful after dragging.
var dropSuccess = false;

const newspaperSpinning = [
  { transform: "rotate(0) scale(1)" },
  { transform: "rotate(360deg) scale(1)" },
  //{ transform: 'translateY(0px)' }, 
  //{ transform: 'translateY(-300px)' }
];

const newspaperTiming = {
  duration: 1000,
  iterations: 1,
};

export default class StoryColumn {
  constructor(name) {
    this.name = name;

  }

  createColumn() {
    const div = createElementWithClasses('div');
    const titleDiv = createElementWithClasses("div", "title");
    const column = createElementWithClasses("div", "flex-column", "story-column");
    column.setAttribute("id", this.name);
    titleDiv.append(this.name.toUpperCase());
    div.append(titleDiv);
    div.append(column);
    this.column = column;

    titleDiv.addEventListener("click", this.onSort);
    column.addEventListener("drop", this.onDropSticky);
    column.addEventListener("dragover", () => {
      event.preventDefault();
    });
    column.addEventListener("dragend", this.onDragEndSticky);

    return div;
  }

  onSort = () => {
    this.column.style.flexDirection = this.column.style.flexDirection === "column-reverse" ? "column" : "column-reverse";
    this.column.style.justifyContent = this.column.style.justifyContent === "flex-end" ? "flex-start" : "flex-end";
  };

  onDropSticky = () => {

    //console.log("drop", event.clientY);
    event.preventDefault();

    //GS if (this.column.id === "story") return;
    try{
      let object = JSON.parse(event.dataTransfer.getData("text/plain"));
      //GS if(object.column === "done")
      //GS return;
    }
    catch(e){return;}

    try {
      dropSuccess = true;
      const stickyData = JSON.parse(event.dataTransfer.getData("text/plain"));
      const sticky = new Sticky(stickyData.name, stickyData.description, stickyData.type, stickyData.priority, this.column.id);

/*
      console.log(event.currentTarget);
      for ( let node of event.currentTarget.childNodes ) {
          console.log(node.getBoundingClientRect());
      }
*/

      //let new_node = sticky.createSticky();
      //event.currentTarget.append(new_node);

      //let new_node = sticky.createSticky();
      //event.currentTarget.childNodes[0].after(new_node);

      //let new_node = sticky.createSticky();
      //event.currentTarget.childNodes[0].before(new_node);
	    //
      let new_node = sticky.createSticky();
      new_node.animate(newspaperSpinning, newspaperTiming);
      let childNodes = event.currentTarget.childNodes;
      let childLen = event.currentTarget.childNodes.length;
      let drop = false;
      if ( childNodes.length == 0 ) {
           event.currentTarget.append(new_node);
           drop = true;

      } else {
          if ((childNodes[0].getBoundingClientRect().y +
               childNodes[0].getBoundingClientRect().height/2) > event.clientY) {
                //console.log("drag top")
                childNodes[0].before(new_node);
                drop = true;

	  } else if ((childNodes[childLen -1].getBoundingClientRect().y + 
		      childNodes[childLen -1].getBoundingClientRect().height /2) < event.clientY) {
                //console.log("drag bottom")
                event.currentTarget.append(new_node);
                drop = true;


	  } else {
               let ey = event.clientY;
           
               for ( let i = 0 ; i < childLen -1  ; i++ ) {
                       //console.log(childNodes[i]);
                       let up_node_rect = childNodes[i].getBoundingClientRect();
                       let down_node_rect = childNodes[i+1].getBoundingClientRect();
		       let uy = up_node_rect.y + up_node_rect.height/2
		       let dy = down_node_rect.y + down_node_rect.height/2
		       if ( uy <= ey && ey <= dy )  {
                          childNodes[i].after(new_node);
                          drop = true;
			  break;

		       }
	       }
          }
      }
      if (!drop) {
            console.lof("un drop");
	    return;
      }
      /*
      setTimeout(() => {
        this.column.classList.remove("transition-affect-on");
      }, 2000);
      this.column.classList.add("transition-affect-on");
      */
    } catch (e) {}
  };

  onDragEndSticky = () => {
    if (event.target.classList?.contains("sticky") && event.dataTransfer.dropEffect !== "none") {
      if (dropSuccess) {
        event.target.remove();
        dropSuccess = false;
      }
    }
  };
}
