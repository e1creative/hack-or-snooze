"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, filter="all", arr) {
  //console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // if filter == "all", our arr argument will be the users favorites
  if (filter == "all") {
    let html = `<li id="${story.storyId}">`;
    
    // if the user is logged in, we need to add the stars
    if (currentUser) {
      // if  user logged in, add stars
      html += `<span class="star">`;

      // if story id is in user.favorites, add a filled star
      html += arr.includes(story.storyId) ? `<i class="fa-star fas"></i>` : `<i class="far fa-star"></i>`;
  
      html += `</span>`;
  
    };
  
    html += `
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
    `;

    return html;
  }

  // if filter == "favorites", our arr argument will be the favorites array
  if (filter == "favorites") {
    if (arr.includes(story.storyId)) {
      return(`
      <li id="${story.storyId}">
        <span class="star">
          <i class="fa-star fas"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
      `);
    };
    return "";
  }

  // if filter == "my-stories", our arr argument will be the users array
  if (filter =="my-stories") {
    if (arr.includes(story.storyId)) {
      return(`
      <li id="${story.storyId}">
        <span class="trash-can">
          <i class="fas fa-trash-alt"></i>
        </span>
        <span class="star">
          <i class="fa-star fas"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
      `);
    };
    return "";
  }
};


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  let favoriteStories;

  if (currentUser){
    // get the array of favorite stories
    favoriteStories = currentUser.favorites.map(function(el) {
      return(el.storyId);
    });
  }

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story, "all", favoriteStories);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();

  $("#all-stories-list li .star i").on('click', storiesListStarClick)
}


/** Gets list of FAVORITE stories from server, generates their HTML, and puts on page. */

function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $allStoriesList.empty();

  // get the array of favorite stories
  let favoriteStories = currentUser.favorites.map(function(el) {
    return(el.storyId);
  });

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story, "favorites", favoriteStories);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();

  $("#all-stories-list li .star i").on('click', storiesListStarClick)
}

/** Gets list of USERS stories from server, generates their HTML, and puts on page. */

function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  $allStoriesList.empty();

  // get the array of my stories
  let myStories = currentUser.ownStories.map(function(el) {
    return(el.storyId);
  })

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story, "my-stories", myStories);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();

  $("#all-stories-list li .star i").on('click', storiesListStarClick)
  $("#all-stories-list li .trash-can i").on('click', storiesListDeleteClick)
}

/** Adds a new story to the db */

async function submitFormAddClick(evt) {
  console.debug("submitFormAddClick", evt);
  evt.preventDefault();

  let author = $authorInput.val();
  let title = $titleInput.val();
  let url = $urlInput.val();

  let newStory = await storyList.addStory(currentUser, {author, title, url}); 

  $submitForm.trigger("reset");

  generateStoryMarkup();
  putStoriesOnPage();
}

$submitForm.on("submit", submitFormAddClick);


/** on clicking the star, toggle the star and call the appropriate function */

async function storiesListStarClick(evt) {
  console.debug("uiStarClick", evt);
  evt.preventDefault();

  const storyID = evt.target.parentElement.parentElement.getAttribute('id');

  // post is not favorited and clicking it will add it to favorites
  if (evt.target.classList.contains('far')) {
    await favoritePost(currentUser, storyID);
    evt.target.classList.remove('far');
    evt.target.classList.add('fas');

  // post is favorited and clicking it will remove it from favorites
  } else if (evt.target.classList.contains('fas')) {
    await unfavoritePost(currentUser,storyID);
    evt.target.classList.remove('fas');
    evt.target.classList.add('far');

  }
}


/** on clicking the trash can, delete the post */

async function storiesListDeleteClick(evt) {
  console.debug("storiesListDeleteClick", evt);
  evt.preventDefault();

  const storyID = evt.target.parentElement.parentElement.getAttribute('id');

  const response = await axios({
    url: `${BASE_URL}/stories/${storyID}`,
    method: "DELETE",
    data: {
      "token": currentUser.loginToken,
    },
  });
  console.log(response.data.message)
  return (response.data.message)
}