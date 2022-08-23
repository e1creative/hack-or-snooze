"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  if (currentUser) {
    $mainNavLinks.show();
  };
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user clicks the submit button */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $mainNavLinks.show();
  $submitForm.show();
}

$navSubmit.on("click", navSubmitClick);


/** When a user clicks the favorites button */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $mainNavLinks.show();
  putFavoriteStoriesOnPage();

}

$navFavorites.on("click", navFavoritesClick);


/** When a user clicks the myStories button */

function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $mainNavLinks.show();
  putMyStoriesOnPage();
}

$navMyStories.on("click", navMyStoriesClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $mainNavLinks.show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
