/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2016, Codrops
 * http://www.codrops.com
 */
(function (window) {
  "use strict";

  // helper functions
  // from https://davidwalsh.name/vendor-prefix
  var prefix = (function () {
    var styles = window.getComputedStyle(document.documentElement, ""),
      pre = (Array.prototype.slice
        .call(styles)
        .join("")
        .match(/-(moz|webkit|ms)-/) ||
        (styles.OLink === "" && ["", "o"]))[1],
      dom = "WebKit|Moz|MS|O".match(new RegExp("(" + pre + ")", "i"))[1];

    return {
      dom: dom,
      lowercase: pre,
      css: "-" + pre + "-",
      js: pre[0].toUpperCase() + pre.substr(1),
    };
  })();

  // vars & stuff
  var support = { transitions: Modernizr.csstransitions },
    transEndEventNames = {
      WebkitTransition: "webkitTransitionEnd",
      MozTransition: "transitionend",
      OTransition: "oTransitionEnd",
      msTransition: "MSTransitionEnd",
      transition: "transitionend",
    },
    transEndEventName = transEndEventNames[Modernizr.prefixed("transition")],
    onEndTransition = function (el, callback, propTest) {
      var onEndCallbackFn = function (ev) {
        if (support.transitions) {
          if (
            ev.target != this ||
            (propTest &&
              ev.propertyName !== propTest &&
              ev.propertyName !== prefix.css + propTest)
          )
            return;
          this.removeEventListener(transEndEventName, onEndCallbackFn);
        }
        if (callback && typeof callback === "function") {
          callback.call(this);
        }
      };
      if (support.transitions) {
        el.addEventListener(transEndEventName, onEndCallbackFn);
      } else {
        onEndCallbackFn();
      }
    },
    // the mall element
    mall = document.querySelector(".mall"),
    // mall´s levels wrapper
    mallLevelsEl = mall.querySelector(".levels"),
    // mall´s levels
    mallLevels = [].slice.call(mallLevelsEl.querySelectorAll(".level")),
    // total levels
    mallLevelsTotal = mallLevels.length,
    // surroundings elems
    mallSurroundings = [].slice.call(mall.querySelectorAll(".surroundings")),
    // selected level position
    selectedLevel,
    // navigation element wrapper
    mallNav = document.querySelector(".mallnav"),
    // show all mall´s levels ctrl
    allLevelsCtrl = mallNav.querySelector(".mallnav__button--all-levels"),
    // levels navigation up/down ctrls
    levelUpCtrl = mallNav.querySelector(".mallnav__button--up"),
    levelDownCtrl = mallNav.querySelector(".mallnav__button--down"),
    // pins
    pins = [].slice.call(mallLevelsEl.querySelectorAll(".pin")),
    // content element
    contentEl = document.querySelector(".content"),
    // content close ctrl
    contentCloseCtrl = contentEl.querySelector("button.content__button"),
    // check if a content item is opened
    isOpenContentArea,
    // check if currently animating/navigating
    isNavigating,
    // check if all levels are shown or if one level is shown (expanded)
    isExpanded,
    // spaces list element
    // spacesListEl = document.getElementById('spaces-list'),
    // spaces list ul
    // spacesEl = spacesListEl.querySelector('ul.list'),
    // all the spaces listed
    // spaces = [].slice.call(spacesEl.querySelectorAll('.list__item > a.list__link')),
    // reference to the current shows space (name set in the data-name attr of both the listed spaces and the pins on the map)
    spaceref,
    // sort by ctrls
    // sortByNameCtrl = document.querySelector('#sort-by-name'),
    // listjs initiliazation (all mall´s spaces)
    // spacesList = new List('spaces-list', { valueNames: ['list__link', { data: ['level'] }, { data: ['category'] } ]} ),

    // smaller screens:
    // open search ctrl
    openSearchCtrl = document.querySelector("button.open-search"),
    // main container
    containerEl = document.querySelector(".container");
  // close search ctrl
  // closeSearchCtrl = spacesListEl.querySelector('button.close-search');

  function init() {
    // init/bind events
    initEvents();
  }

  const firstMallDiv = document.getElementsByClassName("level level--1")[0];
  const firstLevelPinsDiv = firstMallDiv.querySelectorAll(
    ":scope > .level__pins"
  )[0];

  let data;
  let weekNumber = 0;

  const categoryMapping = {
    Essentials: "1",
    "Other products": "2",
    "Hot Sellers": "3",
    null: "4",
  };

  const iconMapping = {
    1: "tomato",
    2: "pyramid",
    3: "heart",
    4: "modx",
  };

  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return [d.getUTCFullYear(), weekNo];
  }

  let currentWeekNumber;

  async function getResponse() {
    const response = await fetch("https://smos-api.vercel.app/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    data = responseData;
    //updatePageContent(weekNumber);
  }

  $(function () {
    $(".calendar").datepicker({
      dateFormat: "dd/mm/yy",
      firstDay: 1,
      onSelect: function (selectedDate) {
        var parts = selectedDate.split("/");
        var date = new Date(parts[2], parts[1] - 1, parts[0]);

        var weekInfo = getWeekNumber(date);
        var newWeekNumber = weekInfo[1];
        updatePageContent(newWeekNumber);

        // weekNumber = newWeekNumber;
        // console.log("Year: " + weekInfo[0] + ", Week number: " + weekInfo[1]);

        // if (
        //   currentWeekNumber !== undefined &&
        //   currentWeekNumber !== newWeekNumber
        // ) {
        //   // If week number changed, update the relevant parts of the page
        //   updatePageContent(newWeekNumber);
        // }
        // currentWeekNumber = newWeekNumber;

        $(this).trigger("blur");

        var $calendar = $(this);
        var $parent = $calendar.parents(".date-picker");
        $parent.find(".result").children("span").html(selectedDate);
        $parent.toggleClass("open");
      },
    });

    $(document).on("click", ".date-picker .input", function (e) {
      var $me = $(this),
        $parent = $me.parents(".date-picker");
      $parent.toggleClass("open");
    });
  });

  function updatePageContent(weekNumber) {
    const dataObj = Object.values(data["result"])[weekNumber]["Type"];

    const dataArray = [];
    let uniqueKey = 0;
    let categoryCounter = {};

    for (const category in dataObj) {
      if (dataObj.hasOwnProperty(category)) {
        const categoryNumber = categoryMapping[category] || "Unknown"; // Default to 'Unknown' if no mapping found
        const categoryIcon = iconMapping[categoryNumber];
        const departments = dataObj[category].Dept;
        categoryCounter[categoryNumber] = 0;

        for (const department in departments) {
          if (departments.hasOwnProperty(department)) {
            if (++categoryCounter[categoryNumber] > 2) {
              continue; // Skip if more than 3 items are already added for this category
            }
            const departmentData = departments[department];
            dataArray.push({
              key: uniqueKey++,
              category: categoryNumber,
              categoryIcon: categoryIcon,
              department: department,
              ...departmentData,
            });
          }
        }
      }
    }

    dataArray.forEach((item) => {
      item.SALES = Math.floor(parseFloat(item.SALES)).toLocaleString();
      item.sales_2023 = Math.floor(
        parseFloat(item.sales_2023)
      ).toLocaleString();
      item.predicted_storage = Math.floor(
        parseFloat(item.predicted_storage)
      ).toString();
    });

    // const buildPins = ({ key, category, categoryIcon }) => `
    // 	<a class="pin pin--${category}-${key}" key=${key} data-category=${category} data-space="0" href="#" aria-label="Pin for ${categoryIcon}">
    // 		<span class="pin__icon">
    // 			<svg class="icon icon--pin"><use xlink:href="#icon-pin"></use></svg>
    // 			<svg class="icon icon--logo icon--${categoryIcon}"><use xlink:href="#icon-${categoryIcon}"></use></svg>
    // 		</span>
    // 	</a>
    // `;

    // function renderLevelPins() {
    //   const pinsHtml = dataArray.map(buildPins);
    //   firstLevelPinsDiv.innerHTML = pinsHtml.join("");
    // }

    //     const buildContentItem = ({
    //       key,
    //       category,
    //       department,
    //       SALES,
    //       original_storage,
    //       ratio_change,
    //       sales_2023,
    //       predicted_storage,
    //     }) => `
    // 	  <li class="content__item" data-space="${category}.0${key}" data-category="${category}">
    // 		  <h3 class="content__item-title"><b>${department}</b></h3>
    // 			  <div class="content__item-details">
    // 			  <table class="department-table">
    // 				<tbody>
    // 					<tr>
    // 						<th>Sales of Past Year:</th>
    // 						<td>$ ${sales_2023}</td>
    // 						<th>Sales Prediction:</th>
    // 						<td>$ ${SALES}</td>
    // 						<th>Ratio Change:</th>
    // 						<td id="ratioChangeValue">${ratio_change}<span id="ratioChangeArrow"></span></td>
    // 					</tr>
    // 					<tr>
    // 						<th>Original Storage:</th>
    // 						<td>${original_storage} units</td>
    // 						<th>Predicted Storage:</th>
    // 						<td>${predicted_storage} units</td>
    // 					</tr>
    // 				</tbody>
    // 			</table>
    // 		</li>
    //   `;

    // function renderContentDiv() {
    //   const contentListHtml = dataArray.map(buildContentItem);

    //   contentEl.innerHTML = contentListHtml.join("");
    // }

    // renderLevelPins();

    // renderContentDiv();

    var pins = [].slice.call(mallLevelsEl.querySelectorAll(".pin"));
    pins.forEach(function (pin) {
      var contentItem = contentEl.querySelector(
        '.content__item[data-space="' + pin.getAttribute("data-space") + '"]'
      );

      var keyPin = pin.getAttribute("key");

      let dataOfDept = dataArray[keyPin];

      pin.addEventListener("mouseenter", function () {
        if (!isOpenContentArea) {
          classie.add(contentItem, "content__item--hover");
        }
      });

      pin.addEventListener("mouseleave", function () {
        if (!isOpenContentArea) {
          classie.remove(contentItem, "content__item--hover");
        }
      });

      pin.addEventListener("click", function (ev) {
        console.log(1);
        ev.preventDefault();
        // open content for this pin
        console.log(2);
        openContent(pin.getAttribute("data-space"));
        // remove hover class (showing the title)
        console.log(3);
        classie.remove(contentItem, "content__item--hover");
        // 假设 dataOfDept 是你的数据对象
        console.log(4);
        document.getElementById(
          "departmentName"
        ).textContent = `${dataOfDept.department}`;
        document.getElementById(
          "sales2023Value"
        ).textContent = `$ ${dataOfDept.sales_2023}`;
        document.getElementById(
          "salesPredictionValue"
        ).textContent = `$ ${dataOfDept.SALES}`;
        document.getElementById("ratioChangeValue").textContent =
          dataOfDept.ratio_change;
        document.getElementById(
          "originalStorageValue"
        ).textContent = `${dataOfDept.original_storage} units`;
        document.getElementById(
          "predictedStorageValue"
        ).textContent = `${dataOfDept.predicted_storage} units`;
      });
    });
  }

  /**
   * Initialize/Bind events fn.
   */
  function initEvents() {
    // click on a Mall´s level
    mallLevels.forEach(function (level, pos) {
      level.addEventListener("click", function () {
        // shows this level
        showLevel(pos + 1);
      });
    });

    // click on the show mall´s levels ctrl
    allLevelsCtrl.addEventListener("click", function () {
      // shows all levels
      showAllLevels();
    });

    // navigating through the levels
    levelUpCtrl.addEventListener("click", function () {
      navigate("Down");
    });
    levelDownCtrl.addEventListener("click", function () {
      navigate("Up");
    });

    getResponse();
    // updatePageContent();

    // sort by name ctrl - add/remove category name (css pseudo element) from list and sorts the spaces by name
    // sortByNameCtrl.addEventListener('click', function() {
    // 	if( this.checked ) {
    // 		classie.remove(spacesEl, 'grouped-by-category');
    // 		spacesList.sort('list__link');
    // 	}
    // 	else {
    // 		classie.add(spacesEl, 'grouped-by-category');
    // 		spacesList.sort('category');
    // 	}
    // });

    // closing the content area
    contentCloseCtrl.addEventListener("click", function () {
      closeContentArea();
    });

    // clicking on a listed space: open level - shows space
    // spaces.forEach(function(space) {
    // 	var spaceItem = space.parentNode,
    // 		level = spaceItem.getAttribute('data-level'),
    // 		spacerefval = spaceItem.getAttribute('data-space');

    // 	space.addEventListener('click', function(ev) {
    // 		ev.preventDefault();
    // 		// for smaller screens: close search bar
    // 		closeSearch();
    // 		// open level
    // 		showLevel(level);
    // 		// open content for this space
    // 		openContent(spacerefval);
    // 	});
    // });

    // smaller screens: open the search bar
    // openSearchCtrl.addEventListener('click', function() {
    // 	openSearch();
    // });

    // smaller screens: close the search bar
    // closeSearchCtrl.addEventListener('click', function() {
    // 	closeSearch();
    // });
  }

  /**
   * Opens a level. The current level moves to the center while the other ones move away.
   */
  function showLevel(level) {
    if (isExpanded) {
      return false;
    }

    // update selected level val
    selectedLevel = level;

    // control navigation controls state
    setNavigationState();

    classie.add(mallLevelsEl, "levels--selected-" + selectedLevel);

    // the level element
    var levelEl = mallLevels[selectedLevel - 1];
    classie.add(levelEl, "level--current");

    onEndTransition(
      levelEl,
      function () {
        classie.add(mallLevelsEl, "levels--open");

        // show level pins
        showPins();

        isExpanded = true;
      },
      "transform"
    );

    // hide surroundings element
    hideSurroundings();

    // show mall nav ctrls
    showMallNav();

    // filter the spaces for this level
    // showLevelSpaces();
  }

  /**
   * Shows all Mall´s levels
   */
  function showAllLevels() {
    if (isNavigating || !isExpanded) {
      return false;
    }
    isExpanded = false;

    classie.remove(mallLevels[selectedLevel - 1], "level--current");
    classie.remove(mallLevelsEl, "levels--selected-" + selectedLevel);
    classie.remove(mallLevelsEl, "levels--open");

    // hide level pins
    removePins();

    // shows surrounding element
    showSurroundings();

    // hide mall nav ctrls
    hideMallNav();

    // show back the complete list of spaces
    spacesList.filter();

    // close content area if it is open
    if (isOpenContentArea) {
      closeContentArea();
    }
  }

  /**
   * Shows all spaces for current level
   */
  // function showLevelSpaces() {
  // 	spacesList.filter(function(item) {
  // 		return item.values().level === selectedLevel.toString();
  // 	});
  // };

  /**
   * Shows the level´s pins
   */
  function showPins(levelEl) {
    var levelEl = levelEl || mallLevels[selectedLevel - 1];
    classie.add(levelEl.querySelector(".level__pins"), "level__pins--active");
  }

  /**
   * Removes the level´s pins
   */
  function removePins(levelEl) {
    var levelEl = levelEl || mallLevels[selectedLevel - 1];
    classie.remove(
      levelEl.querySelector(".level__pins"),
      "level__pins--active"
    );
  }

  /**
   * Show the navigation ctrls
   */
  function showMallNav() {
    classie.remove(mallNav, "mallnav--hidden");
  }

  /**
   * Hide the navigation ctrls
   */
  function hideMallNav() {
    classie.add(mallNav, "mallnav--hidden");
  }

  /**
   * Show the surroundings level
   */
  function showSurroundings() {
    mallSurroundings.forEach(function (el) {
      classie.remove(el, "surroundings--hidden");
    });
  }

  /**
   * Hide the surroundings level
   */
  function hideSurroundings() {
    mallSurroundings.forEach(function (el) {
      classie.add(el, "surroundings--hidden");
    });
  }

  /**
   * Navigate through the mall´s levels
   */
  function navigate(direction) {
    if (isNavigating || !isExpanded || isOpenContentArea) {
      return false;
    }
    isNavigating = true;

    var prevSelectedLevel = selectedLevel;

    // current level
    var currentLevel = mallLevels[prevSelectedLevel - 1];

    if (direction === "Up" && prevSelectedLevel > 1) {
      --selectedLevel;
    } else if (direction === "Down" && prevSelectedLevel < mallLevelsTotal) {
      ++selectedLevel;
    } else {
      isNavigating = false;
      return false;
    }

    // control navigation controls state (enabled/disabled)
    setNavigationState();
    // transition direction class
    classie.add(currentLevel, "level--moveOut" + direction);
    // next level element
    var nextLevel = mallLevels[selectedLevel - 1];
    // ..becomes the current one
    classie.add(nextLevel, "level--current");

    // when the transition ends..
    onEndTransition(currentLevel, function () {
      classie.remove(currentLevel, "level--moveOut" + direction);
      // solves rendering bug for the SVG opacity-fill property
      setTimeout(function () {
        classie.remove(currentLevel, "level--current");
      }, 60);

      classie.remove(mallLevelsEl, "levels--selected-" + prevSelectedLevel);
      classie.add(mallLevelsEl, "levels--selected-" + selectedLevel);

      // show the current level´s pins
      showPins();

      isNavigating = false;
    });

    // filter the spaces for this level
    showLevelSpaces();

    // hide the previous level´s pins
    removePins(currentLevel);
  }

  /**
   * Control navigation ctrls state. Add disable class to the respective ctrl when the current level is either the first or the last.
   */
  function setNavigationState() {
    if (selectedLevel == 1) {
      classie.add(levelDownCtrl, "boxbutton--disabled");
    } else {
      classie.remove(levelDownCtrl, "boxbutton--disabled");
    }

    if (selectedLevel == mallLevelsTotal) {
      classie.add(levelUpCtrl, "boxbutton--disabled");
    } else {
      classie.remove(levelUpCtrl, "boxbutton--disabled");
    }
  }

  /**
   * Opens/Reveals a content item.
   */
  function openContent(spacerefval) {
    // if one already shown:
    if (isOpenContentArea) {
      hideSpace();
      spaceref = spacerefval;
      showSpace();
    } else {
      spaceref = spacerefval;
      openContentArea();
    }

    // remove class active (if any) from current list item
    // var activeItem = spacesEl.querySelector('li.list__item--active');
    // if( activeItem ) {
    // 	classie.remove(activeItem, 'list__item--active');
    // }
    // list item gets class active
    // classie.add(spacesEl.querySelector('li[data-space="' + spacerefval + '"]'), 'list__item--active');

    // remove class selected (if any) from current space
    var activeSpaceArea = mallLevels[selectedLevel - 1].querySelector(
      "svg > .map__space--selected"
    );
    if (activeSpaceArea) {
      classie.remove(activeSpaceArea, "map__space--selected");
    }
    // svg area gets selected
    // classie.add(
    //   mallLevels[selectedLevel - 1].querySelector(
    //     'svg > .map__space[data-space="' + spaceref + '"]'
    //   ),
    //   "map__space--selected"
    // );
  }

  /**
   * Opens the content area.
   */
  function openContentArea() {
    isOpenContentArea = true;
    // shows space
    showSpace(true);
    // show close ctrl
    classie.remove(contentCloseCtrl, "content__button--hidden");
    // resize mall area
    classie.add(mall, "mall--content-open");
    // disable mall nav ctrls
    classie.add(levelDownCtrl, "boxbutton--disabled");
    classie.add(levelUpCtrl, "boxbutton--disabled");
  }

  /**
   * Shows a space.
   */
  function showSpace(sliding) {
    // the content item
    var contentItem = contentEl.querySelector(
      '.content__item[data-space="' + spaceref + '"]'
    );
    // show content
    classie.add(contentItem, "content__item--current");
    if (sliding) {
      onEndTransition(contentItem, function () {
        classie.add(contentEl, "content--open");
      });
    }
    // map pin gets selected
    classie.add(
      mallLevelsEl.querySelector('.pin[data-space="' + spaceref + '"]'),
      "pin--active"
    );
  }

  /**
   * Closes the content area.
   */
  function closeContentArea() {
    classie.remove(contentEl, "content--open");
    // close current space
    hideSpace();
    // hide close ctrl
    classie.add(contentCloseCtrl, "content__button--hidden");
    // resize mall area
    classie.remove(mall, "mall--content-open");
    // enable mall nav ctrls
    if (isExpanded) {
      setNavigationState();
    }
    isOpenContentArea = false;
  }

  /**
   * Hides a space.
   */
  function hideSpace() {
    // the content item
    var contentItem = contentEl.querySelector(
      '.content__item[data-space="' + spaceref + '"]'
    );
    // hide content
    classie.remove(contentItem, "content__item--current");
    // map pin gets unselected
    classie.remove(
      mallLevelsEl.querySelector('.pin[data-space="' + spaceref + '"]'),
      "pin--active"
    );
    // remove class active (if any) from current list item
    // var activeItem = spacesEl.querySelector('li.list__item--active');
    // if( activeItem ) {
    // 	classie.remove(activeItem, 'list__item--active');
    // }
    // remove class selected (if any) from current space
    var activeSpaceArea = mallLevels[selectedLevel - 1].querySelector(
      "svg > .map__space--selected"
    );
    if (activeSpaceArea) {
      classie.remove(activeSpaceArea, "map__space--selected");
    }
  }

  /**
   * for smaller screens: open search bar
   */
  function openSearch() {
    // shows all levels - we want to show all the spaces for smaller screens
    showAllLevels();

    classie.add(spacesListEl, "spaces-list--open");
    classie.add(containerEl, "container--overflow");
  }

  /**
   * for smaller screens: close search bar
   */
  function closeSearch() {
    classie.remove(spacesListEl, "spaces-list--open");
    classie.remove(containerEl, "container--overflow");
  }

  init();
})(window);
