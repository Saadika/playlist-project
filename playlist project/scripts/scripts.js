'use strict'

var xhttp = new XMLHttpRequest();
const url = "json/data.json";
let response;
let playButton = false;
let data;
let itemArray = new Array;
document.getElementById('song_options').style.display = 'none';

xhttp.onreadystatechange = function() {

    if (this.readyState === 4 && this.status === 200) {
        response = JSON.parse(this.responseText);
        loadPlaylist();
    }

}
xhttp.open("GET", url, true);

xhttp.send();

function loadPlaylist() {
    for (let items in response) {
        let responseItems = response[items];
        let title = responseItems.playlistTitle;

        let button = document.createElement('button');
        let span = document.createElement('span');
        button.className = 'playlist_options-items ' + title;
        document.getElementById('playlist_options').appendChild(button).appendChild(span);
        span.innerHTML += title;

        let parent = document.getElementById('playlist_options');
        let nodesSameClass = parent.getElementsByClassName('playlist_options-items');
        for(let i = 0; i < nodesSameClass.length; i++) {
            nodesSameClass[i].onclick = function() {
               playlistSelection(nodesSameClass[i].innerText);
               hidePlaylist();
            }
        }
        
    }

    
}

function playlistSelection(selection) {
   response.filter(d => d.playlistTitle === selection).map(x => {

       switch(x.playlistTitle) {
        case 'Hip Hop':
            getSongList(x.songList);
            draggable();
            break;
        case 'Electronic dance music (EDM)':
            getSongList(x.songList);
            draggable();
            break;
        case 'Rap':
            getSongList(x.songList);
            draggable();
            break;
        case 'Chillhop':
            getSongList(x.songList);
            draggable();
            break;  
        default: ''
    }
   })
    
}

function getSongList(songlist) {
    let html = '';
    itemArray = songlist;
    for(let i = 0; i < songlist.length; i++) {
        html += '<div class="song_items draggable col-md-12 '+ songlist[i].songTitle +'" draggable="true"><div class="song_image col-md-2"><img src="'
            + songlist[i].image + '" alt="' + songlist[i].songTitle + '"/></div><div class="col-md-1"></div><div class="song_right col-md-8"><div class="song_title">' 
            + songlist[i].songTitle + '</div> <div class="song_artist">Artist: ' 
            + songlist[i].artist  + '</div> <div class="song_album">Album: '
            + songlist[i].album  + 
            '</div> <div class="song_duration"><div class="play_icon"><i class="bi bi-play-fill" onclick="play(this)"></i></div><div class="progress"> <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div><div class="song_duration-time">'
            + songlist[i].songDuration + '</div></div> <div class="song_footer-container"><div class="song_footer-liked"><i class="bi bi-hand-thumbs-up" onclick="likeToggle(this)"></i></div><div class="trash"><i class="bi bi-trash" onclick="removeItem(this)"></i></div></div></div></div>';

    }

    document.querySelector('.song_options-list').innerHTML = html;
}

function hidePlaylist() {
    document.getElementById('playlist_options').style.display = 'none';
    document.getElementById('song_options').style.display = 'block';
    let backButton = '<div class="row"><div class="back_button col-md-4" onclick="showPlaylist()"><i class="bi bi-arrow-left"></i> Back to playlist</div><div class="heading col-md-4"><h2 class="py-3">Song list</h2></div></div>';
    document.querySelector('header').innerHTML = backButton;
}

function showPlaylist() {
    document.getElementById('song_options').style.display = 'none';
    document.getElementById('playlist_options').style.display = 'flex';
    let playlistHeader = `<div class="row"><div class="heading col-md-12"><h2 class="py-3">Playlists</h2></div></div>`;
    document.querySelector('header').innerHTML = playlistHeader;
}

function draggable() {
    const draggables = document.querySelectorAll('.draggable')
    const containers = document.querySelectorAll('.song_options-list')
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging')
        })

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging')
        })
    })

    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault()
            const afterElement = getDragAfterElement(container, e.clientY)
            const draggable = document.querySelector('.dragging')
            if (afterElement == null) {
            container.appendChild(draggable)
            } else {
            container.insertBefore(draggable, afterElement)
            }
        })
    })

    function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2
            if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
            } else {
            return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
    }

}

function likeToggle(x) {
    x.classList.toggle("bi-hand-thumbs-up-fill");
    x.classList.toggle("bi-hand-thumbs-up");
}

function play(x) {
    x.classList.toggle('bi-pause');
    x.classList.toggle('bi-play-fill');
}

function removeItem(item) {
    let selectedItem = document.querySelector('.song_title').innerHTML;
    let selectedItemParent = document.querySelector('.song_options-list')
    for(let i = 0; i < itemArray.length; i++) {
        let index = itemArray[i].songTitle.indexOf(selectedItem);
        if (index > -1) { 
            itemArray.splice(index, 1);
            selectedItemParent.removeChild(selectedItemParent.childNodes[i]);
        };   
    }
    
}