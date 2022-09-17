  import "./css/style.css"
  import apiFetch from "./js/fetch.js";
  import { Notify } from 'notiflix';
  import gallaryMarkup from './templates/gallaryMarkup.hbs'
  import SimpleLightbox from "simplelightbox";
  import "simplelightbox/dist/simple-lightbox.min.css";



const refs = {
  search: document.querySelector ('#search-form'),
  gallery: document.querySelector ('.gallery'),
  loadMore: document.querySelector ('.load_more_btn')
}

refs.search.addEventListener ('submit', onSearch)
refs.loadMore.addEventListener ('click', onloadMore)

const fetchPhoto = new apiFetch ()
const gallery = new SimpleLightbox ('gallary a', {})



function onSearch (e) {
  e.preventDefault()
  refs.loadMore.classList.remove ('is-hidden')
  refs.gallery.innerHTML = ''
  fetchPhoto.query = e.currentTarget.elements.searchQuery.value.trim()
  fetchPhoto.resetPage()
      if (fetchPhoto.query === '') {
        refs.loadMore.classList.add ('is-hidden')
        return Notify.info ('Enter your query')
      }
      refs.search.reset ()
      fetchPhoto.fetchApi().then(res => {
        getResponse(res)
          if (fetchPhoto.totalPages <=1) {
            refs.loadMore.classList.add ('is-hidden')
          }
      })
      .catch(e => {
        Notify.failure('error Search')
      })
}

function onloadMore () {
  if (fetchPhoto.page > fetchPhoto.totalPages) {
    refs.loadMore.classList.add ('is-hidden')
    Notify.info ("We're sorry, but you've reached the end of search results.")
    return
  }
  fetchPhoto.fetchApi ().then (res => {
    getResponse(res)
  }).catch (e => {
    Notify.failure ('error Load More')
  })
}


function markupGallary (hits) {
  const createMarkup = gallaryMarkup(hits)
  refs.gallery.insertAdjacentHTML ('beforeend', createMarkup)
}

function getResponse (r) {
  markupGallary (r)
  gallery.refresh()
}




