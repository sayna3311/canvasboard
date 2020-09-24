import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { fabric } from 'fabric';
import Sortable from 'sortablejs/modular/sortable.complete.esm.js';
import { RestService } from '../../services/rest.service';
import {Chart} from 'chart.js';


declare var $: any;

@Component({
  selector: 'app-new-board',
  templateUrl: './new-board.component.html',
  styleUrls: ['./new-board.component.scss'],
})

export class NewBoardComponent implements OnInit {

  fileToUpload: File = null;
  uniqueChartID = (function() {
    var id = 0;
    return function() { return id++; };
  })();

  constructor( private apiService: RestService) {}

  ngOnInit() {
    // sortable-js
    const mainEl = document.getElementById('main-box');
    const sortable = Sortable.create(mainEl);

    // disbale enter on title
    this.disableTitleEnter();

    // ......................... DISABLING ENTER KEYWORD .........................
    $('#original[contenteditable]').keypress((evt) => {
      const keycode = evt.charCode || evt.keyCode;
      if (keycode === 13) {
        // Enter key's keycode
        return false;
      }
    });
    this.addAfterBlockEditor('sub-title', 0);
  }

  // ......................... BLOCK BUILDING FUNCITON............................
  blockFunction = (uid) => {
    let data = `
    <div id="cb-box-1-${uid}" class="cb-box-1">
    <div class="row mx-0">
      <!-- plug for dragging -->
      <div class="col-1 col-cb-1-custom" style="padding: 0px; padding-top: 7px; max-width: 4%; flex: 0 0 4%;">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-justify" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
        </svg>
      </div>
      <div class="col-10 px-0" style="max-width: 90%; flex: 0 0 90%;">
        <!-- content box -->
        <div id="cb-box-2-${uid}" class="cb-box-2 mt-2 mb-2" style="margin-left: 3px; border-radius: 5px;">
          <div class="cb-box-3">
            <div id="original-${uid}" class="edit" contenteditable="true" style="padding-left: 3px;">

            </div>
          </div>
        </div>
      </div>
      <!-- menu icon -->
      <div id="show-more-toolbox-${uid}" class="col-1 px-0" style="max-width: 5%; flex: 0 0 5%;">
        <!-- menu button -->
        <div class="cb-toolbox">
         <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-three-dots" fill="currentColor"
         xmlns="http://www.w3.org/2000/svg">
         <path fill-rule="evenodd"
          d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
         </svg>
        </div>

        <!-- expand toolbox -->
        <div id="cb-expand-more-toolbox-${uid}" class="cb-more-toolbox">
          <div id="cb-buttons-${uid}" class="toolbox-main shadow">
            <!-- delete button -->
            <div class="tool box1 m-1">
              <button class="btn btn-light" id="remove-cb-box1-${uid}">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
              </button>
            </div>
            <!-- h2 tag -->
            <div class="tool box2 m-1">
              <button class="btn btn-light" id="add-h2-box2-${uid}">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-type-h2" fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.638 13V3.669H6.38V7.62H1.759V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V13H15.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z" />
                </svg>
              </button>
            </div>
            <!-- h3 tag -->
            <div class="tool box3 m-1">
              <button class="btn btn-light" id="add-h3-box2-${uid}">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-type-h3" fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.637 13V3.669H6.379V7.62H1.758V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.625-4.272h1.018c1.142 0 1.935.67 1.949 1.674.013 1.005-.78 1.737-2.01 1.73-1.08-.007-1.853-.588-1.935-1.32H9.108c.069 1.327 1.224 2.386 3.083 2.386 1.935 0 3.343-1.155 3.309-2.789-.027-1.51-1.251-2.16-2.037-2.249v-.068c.704-.123 1.764-.91 1.723-2.229-.035-1.353-1.176-2.4-2.954-2.385-1.873.006-2.857 1.162-2.898 2.358h1.196c.062-.69.711-1.299 1.696-1.299.998 0 1.695.622 1.695 1.525.007.922-.718 1.592-1.695 1.592h-.964v1.074z" />
                </svg>
              </button>
            </div>
            <!-- paragraph -->
            <div class="tool box4 m-1">
              <button class="btn btn-light" id="add-p-box2-${uid}">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-text-paragraph" fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z" />
                </svg>
              </button>
            </div>
            <!-- Red Background color button -->
            <div class="tool box1 m-1">
              <button class="btn btn-danger" id="add-background-cb-red-${uid}">
                <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-fonts" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.258 3H3.747l-.082 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.43.013c1.935.062 2.434.301 2.694 1.846h.479L12.258 3z"/>
                </svg>
              </button>
            </div>
            <!-- Green Background color button -->
            <div class="tool box1 m-1">
            <button class="btn btn-success" id="add-background-cb-green-${uid}">
              <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-fonts" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.258 3H3.747l-.082 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.43.013c1.935.062 2.434.301 2.694 1.846h.479L12.258 3z"/>
              </svg>
            </button>
          </div>
          <!-- Yellow Background color button -->
          <div class="tool box1 m-1">
            <button class="btn btn-warning" id="add-background-cb-yellow-${uid}">
              <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-fonts" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.258 3H3.747l-.082 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.43.013c1.935.062 2.434.301 2.694 1.846h.479L12.258 3z"/>
              </svg>
            </button>
          </div>
          <!-- Blue Background color button -->
          <div class="tool box1 m-1">
            <button class="btn btn-primary" id="add-background-cb-blue-${uid}">
              <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-fonts" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.258 3H3.747l-.082 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.43.013c1.935.062 2.434.301 2.694 1.846h.479L12.258 3z"/>
              </svg>
            </button>
          </div>
          <!-- light Background color button -->
          <div class="tool box1 m-1">
            <button class="btn btn-light" id="add-background-cb-light-${uid}">
              <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-fonts" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.258 3H3.747l-.082 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.43.013c1.935.062 2.434.301 2.694 1.846h.479L12.258 3z"/>
              </svg>
            </button>
          </div>
          <!-- Ordered list button -->
          <div class="tool box1 m-1" id="add-ordered-list-${uid}">
            <button class="btn btn-light">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-list-ol" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
              <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
            </svg>
            </button>
          </div>
          <!-- Unordered list button -->
          <div class="tool box1 m-1" id="add-unordered-list-${uid}">
            <button class="btn btn-light">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-list-ul" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              </svg>
            </button>
          </div>
          <!-- Code snippet button -->
          <div class="tool box1 m-1" id="add-code-snippet-${uid}">
            <button class="btn btn-light">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-code-slash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0zm-.999-3.124a.5.5 0 0 1 .33.625l-4 13a.5.5 0 0 1-.955-.294l4-13a.5.5 0 0 1 .625-.33z"/>
              </svg>
            </button>
          </div>
          <!-- Image upload button -->
          <div class="tool box1 m-1" id="add-image-upload-${uid}">
            <button class="btn btn-light">
              <svg width="1.0625em" height="1em" viewBox="0 0 17 16" class="bi bi-image" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M14.002 2h-12a1 1 0 0 0-1 1v9l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094L15.002 9.5V3a1 1 0 0 0-1-1zm-12-1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>
            </button>
          </div>
          <!-- Canvas Board -->
          <div class="tool box1 m-1">
            <button class="btn btn-light" id="add-canvas-cb-${uid}">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
               <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            </svg>
            </button>
          </div>
          <!-- Chart from JSON -->
          <div class="tool box1 m-1">
              <input type="file"
              id="file-${uid}"
              accept=".json"
              #fileUpload
              class="btn btn-light"
              (change)="onFileChanged($event)">
          </div>
            <!-- more -->
            <div class="tool box5 m-1">
              <button class="btn btn-light">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-three-dots" fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg>
              </button>
            </div>
            <!-- top -->
            <div class="tool box5 m-1">
              <button class="btn btn-light" id="add-new-box-prev-${uid}">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-bar-up" fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z" />
                </svg>
              </button>
            </div>
            <!-- bottom -->
            <div class="tool box5 m-1">
              <button class="btn btn-light" id="add-new-box-${uid}">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-bar-down" fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

    `
    return data
  }

  // .........................ADDING BLOCK AFTER THE DIV FUNCTION.................
  addAfterBlockEditor = (id, checker) => {
    try {
      // getting uid and appending after specified ID
      const uid: any = uuidv4();

      if (checker === 0) {
        $(`#${id}`).after(
          this.blockFunction(uid)
        );
      } // close of if statement of 0

      if (checker === 1) {
        $(`#cb-box-1-${id}`).after(
          this.blockFunction(uid)
        );
      } // end of if case 1

      // hiding and showing the TOOLBOX
      $(`#show-more-toolbox-${uid}`).hover(
        // display block
        () => {
          $(`#cb-expand-more-toolbox-${uid}`).css('display', 'block');
        },
        //  display none
        () => {
          $(`#cb-expand-more-toolbox-${uid}`).css('display', 'none');
        }
      );
      // Adding click action of above button
      $(`#add-new-box-prev-${uid}`).click(() => {
        if (checker !== 0) {
          this.addBeforeBlockEditor(uid, 1);
        }
      });

      //  Adding the click action of the below button
      $(`#add-new-box-${uid}`).click(() => {
        this.addAfterBlockEditor(uid, 1);
      });

      // Delete/Remove button
      $(`#remove-cb-box1-${uid}`).click(() => {
        if (checker !== 0) {
          $(`#cb-box-1-${uid}`).remove();
        }
      });
      //Add H1 Tag
      this.addH1TagHTMLCode(uid);
      // Adding H1 Tags
      this.addH1TagClickFunction(uid);


      // Adding H2 Tags
      $(`#add-h2-box2-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`).removeClass('cb-H1 cb-H3').addClass('cb-H2');
      });

      // Adding H3 Tags
      $(`#add-h3-box2-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`).removeClass('cb-H1 cb-H2').addClass('cb-H3');
      });

      // Adding Paragraphs
      $(`#add-p-box2-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`).removeClass('cb-H1 cb-H2 cb-H3');
      });

      // Adding red background color
      $(`#add-background-cb-red-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`)
          .removeClass(
            'cb-background-yellow cb-background-green cb-background-blue'
          )
          .addClass('cb-background-red');
      });
      // Adding blue background color
      $(`#add-background-cb-blue-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`)
          .removeClass(
            'cb-background-yellow cb-background-green cb-background-red'
          )
          .addClass('cb-background-blue');
      });
      // Adding green background color
      $(`#add-background-cb-green-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`)
          .removeClass(
            'cb-background-yellow cb-background-blue cb-background-red'
          )
          .addClass('cb-background-green');
      });
      // Adding yellow background color
      $(`#add-background-cb-yellow-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`)
          .removeClass(
            'cb-background-green cb-background-blue cb-background-red'
          )
          .addClass('cb-background-yellow');
      });
      // Adding Original background color
      $(`#add-background-cb-light-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`).removeClass(
          'cb-background-green cb-background-blue cb-background-red cb-background-yellow'
        );
      });
      // Adding Canvas board
      $(`#add-canvas-cb-${uid}`).click(() => {
        const parentWidth = $(`#original-${uid}`).width();
        console.log('Working canvas board');
        $(`#original-${uid}`).append(`
          <div id="canvas-menu-box" class="canvas-menu-box">
             <input id="canvas-menu-box-${uid}" type="color" style="margin-left: 50%; margin-bottom: 5px;">
          </div>
          <canvas id="canvas-${uid}" class="shadow"></canvas>
        `);
        // This code(styles) should not be added it will cause problems in fabric

        var canvas = new fabric.Canvas(`canvas-${uid}`);
        canvas.isDrawingMode = true;
        canvas.setHeight('400');
        canvas.setWidth(parentWidth);

        // changing pen color
        // canvas.freeDrawingBrush.color
        $(`#canvas-menu-box-${uid}`).on('change', () => {
          let color: any = document.getElementById(`canvas-menu-box-${uid}`);
          let data = color.value;
          canvas.freeDrawingBrush.color = data;
        });
      });

      // Add ordered list
      $(`#add-ordered-list-${uid}`).click(() => {
        $(`#original-${uid}`).append(
          `<ol>
          <li></li>
          </ol>`
        );
      });

      // Add unordered list
      $(`#add-unordered-list-${uid}`).click(() => {
        $(`#original-${uid}`).append(
          `<ul>
          <li></li>
          </ul>`
        );
      });

      // Add code snippet
      $(`#add-code-snippet-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`).addClass('cb-code-snippet');
      });

      // Add upload image
      $(`#add-image-upload-${uid}`).click(() => {
        const imageURL = prompt('Enter Your image URL here');
        const isConfirmed = confirm('The image you selected is correct?');
        if (this.validURL(imageURL)) {
          $(`#original-${uid}`).append(
            `<img src=${imageURL} id="cb-image-${uid}"></img>`
          );
          $(`#cb-image-${uid}`).css('width', '100%');
        } else {
          alert('Please enter a valid URL!!');
        }
      });

      // Upload JSON file
      $(`#file-${uid}`).change((ev) => {
        this.fileToUpload = ev.target.files[0];
        console.log("File Read working")
        const fileReader = new FileReader();
        fileReader.readAsText(this.fileToUpload, "UTF-8");
        fileReader.onload = () => {
          //Parse the JSON into an array of data points
          let dataObject = JSON.parse(fileReader.result as string);

          // ---- Create canvas for chart ----
          $(`#original-${uid}`).append(`
        <canvas id="chart-${uid}" class="shadow"></canvas>
      `)
          //Setting Width and height to screen
          $(`#chart-${uid}`).height(400).width('100%')
          //Setting background color to white
          $(`#chart-${uid}`).css("background-color", "white")

          // End Creating canvas


          // Helper function to toggle data on click
          function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
              e.dataSeries.visible = false;
            } else {
              e.dataSeries.visible = true;
            }
            chart.render();
          }

          // Labels for the data
          let dKeys = Object.keys(dataObject[0]);
          let XAxisName;

          // Get the data array suitable for chartjs
          function getData() {
            let datasetsArr = []
            let xAxisLabels = []
            dKeys.forEach((dLabel, index) => {
              // If label is of x-axis(which should be at the end)
              if (index == dKeys.length - 1) {
                XAxisName = dLabel;

                dataObject.forEach((dataPoint, i) => {

                  //X-axis data pushed into x-axis labels
                  xAxisLabels.push(dataPoint[dLabel]);

                });
              }

              //If label is not of X-axis
              else {

                // Dataset corresponding to label
                let dSet = { label: dLabel, data: [], fill: false, backgroundColor: [], borderColor: [] }

                let r = Math.floor(Math.random() * 255);
                let g = Math.floor(Math.random() * 255);
                let b = Math.floor(Math.random() * 255);
                dSet.backgroundColor.push("rgba(" + r + ", " + g + ", " + b + ",0.2)");
                dSet.borderColor.push("rgb(" + r + ", " + g + ", " + b + ")");

                dataObject.forEach((dataPoint, i) => {
                  //Push each data point corresponding to label into label's dataset
                  dSet.data.push(dataPoint[dLabel]);

                  //Randomise the colours
                });

                //Push the dataset into data array
                datasetsArr.push(dSet);
              }

            })

            console.log("Data compatible with chart js", { labels: xAxisLabels, datasets: datasetsArr });

            return { labels: xAxisLabels, datasets: datasetsArr };

          }


          let ctx = $(`#chart-${uid}`);
          console.log($(`#chart-${uid}`));

          let chart = new Chart(ctx, {
            type: 'line',
            title: {
              text: "Chart " + this.uniqueChartID()
            },
            toolTip: {
              shared: true
            },
            legend: {
              cursor: "pointer",
              verticalAlign: "top",
              horizontalAlign: "center",
              dockInsidePlotArea: true,
              itemclick: toggleDataSeries
            },
            data: getData(),
            options: {
              responsive: true,
              title: "Chart ",
              scales: {
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    //X axis name to be displayed
                    labelString: XAxisName,
                  }
                }]
              }
            }
          });
          chart.render();


          console.log("Data Object", dataObject);
        }
        fileReader.onerror = (error) => {
          console.log(error);
        }



      });

    } catch (err) {
      console.log('Error', err);
    }
  };

  // .........................ADDING BLOCK BEFORE DIV FUNCTION...................
  addBeforeBlockEditor = (id, checker) => {
    try {
      // getting uid and appending after specified ID
      const uid: any = uuidv4();

      if (checker === 0) {
        $(`#${id}`).before(
          this.blockFunction(uid)
        );
      } // close of if statement of 0

      if (checker === 1) {
        $(`#cb-box-1-${id}`).before(
          this.blockFunction(uid)
        );
      }

      // hiding and showing the TOOLBOX
      $(`#show-more-toolbox-${uid}`).hover(
        // display block
        () => {
          $(`#cb-expand-more-toolbox-${uid}`).css('display', 'block');
        },
        //  display none
        () => {
          $(`#cb-expand-more-toolbox-${uid}`).css('display', 'none');
        }
      );
      // Adding click action of above button
      $(`#add-new-box-prev-${uid}`).click(() => {
        if (checker !== 0) {
          this.addBeforeBlockEditor(uid, 1);
        }
      });

      //  Adding the click action of the below button
      $(`#add-new-box-${uid}`).click(() => {
        this.addAfterBlockEditor(uid, 1);
      });

      // Delete/Remove button
      $(`#remove-cb-box1-${uid}`).click(() => {
        if (checker !== 0) {
          $(`#cb-box-1-${uid}`).remove();
        }
      });

      // Adding H1 Tags
      $(`#add-h1-box2-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`).removeClass('cb-H2 cb-H3').addClass('cb-H1');
      });

      // Adding H2 Tags
      $(`#add-h2-box2-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`).removeClass('cb-H1 cb-H3').addClass('cb-H2');
      });

      // Adding H3 Tags
      $(`#add-h3-box2-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`).removeClass('cb-H1 cb-H2').addClass('cb-H3');
      });

      // Adding Paragraphs
      $(`#add-p-box2-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`).removeClass('cb-H1 cb-H2 cb-H3');
      });

      // Adding red background color
      $(`#add-background-cb-red-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`)
          .removeClass(
            'cb-background-yellow cb-background-green cb-background-blue'
          )
          .addClass('cb-background-red');
      });

      // Adding blue background color
      $(`#add-background-cb-blue-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`)
          .removeClass(
            'cb-background-yellow cb-background-green cb-background-red'
          )
          .addClass('cb-background-blue');
      });

      // Adding green background color
      $(`#add-background-cb-green-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`)
          .removeClass(
            'cb-background-yellow cb-background-blue cb-background-red'
          )
          .addClass('cb-background-green');
      });

      // Adding yellow background color
      $(`#add-background-cb-yellow-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`)
          .removeClass(
            'cb-background-green cb-background-blue cb-background-red'
          )
          .addClass('cb-background-yellow');
      });

      // Adding Original background color
      $(`#add-background-cb-light-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`).removeClass(
          'cb-background-green cb-background-blue cb-background-red cb-background-yellow'
        );
      });

      // Adding Canvas board
      $(`#add-canvas-cb-${uid}`).click(() => {
        const parentWidth = $(`#original-${uid}`).width();
        console.log('Working canvas board');
        $(`#original-${uid}`).append(`
          <div id="canvas-menu-box" class="canvas-menu-box">
             <input id="canvas-menu-box-${uid}" type="color" style="margin-left: 50%; margin-bottom: 5px;">
          </div>
          <canvas id="canvas-${uid}" class="shadow"></canvas>
        `);
        // This code(styles) should not be added it will cause problems in fabric

        const canvas = new fabric.Canvas(`canvas-${uid}`);
        canvas.isDrawingMode = true;
        canvas.setHeight('400');
        canvas.setWidth(parentWidth);

        // changing pen color
        // canvas.freeDrawingBrush.color
        $(`#canvas-menu-box-${uid}`).on('change', () => {
          const color: any = document.getElementById(`canvas-menu-box-${uid}`);
          const data = color.value;
          canvas.freeDrawingBrush.color = data;
        });
      });

      // Add ordered list
      $(`#add-ordered-list-${uid}`).click(() => {
        $(`#original-${uid}`).append(
          `<ol>
          <li></li>
          </ol>`
        );
      });

      // Add unordered list
      $(`#add-unordered-list-${uid}`).click(() => {
        $(`#original-${uid}`).append(
          `<ul>
          <li></li>
          </ul>`
        );
      });

      // Add code snippet
      $(`#add-code-snippet-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`).addClass('cb-code-snippet');
      });

      // Add upload image
      $(`#add-image-upload-${uid}`).click(() => {
        const imageURL = prompt('Enter Your image URL here');
        const isConfirmed = confirm('The image you selected is correct?');
        if (this.validURL(imageURL)) {
          $(`#original-${uid}`).append(
            `<img src=${imageURL} id="cb-image-${uid}"></img>`
          );
          $(`#cb-image-${uid}`).css('width', '100%');
        } else {
          alert('Please enter a valid URL!!');
        }
      });
      // Upload JSON file
      $(`#file-${uid}`).change((ev) => {
        this.fileToUpload = ev.target.files[0];
        console.log("File Read working")
        const fileReader = new FileReader();
        fileReader.readAsText(this.fileToUpload, "UTF-8");
        fileReader.onload = () => {
          //Parse the JSON into an array of data points
          let dataObject = JSON.parse(fileReader.result as string);

          // ---- Create canvas for chart ----
          $(`#original-${uid}`).append(`
        <canvas id="chart-${uid}" class="shadow"></canvas>
      `)
          //Setting Width and height to screen
          $(`#chart-${uid}`).height(400).width('100%')
          //Setting background color to white
          $(`#chart-${uid}`).css("background-color", "white")

          // End Creating canvas


          // Helper function to toggle data on click
          function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
              e.dataSeries.visible = false;
            } else {
              e.dataSeries.visible = true;
            }
            chart.render();
          }

          // Labels for the data
          let dKeys = Object.keys(dataObject[0]);
          let XAxisName;

          // Get the data array suitable for chartjs
          function getData() {
            let datasetsArr = []
            let xAxisLabels = []
            dKeys.forEach((dLabel, index) => {
              // If label is of x-axis(which should be at the end)
              if (index == dKeys.length - 1) {
                XAxisName = dLabel;

                dataObject.forEach((dataPoint, i) => {

                  //X-axis data pushed into x-axis labels
                  xAxisLabels.push(dataPoint[dLabel]);

                });
              }

              //If label is not of X-axis
              else {

                // Dataset corresponding to label
                let dSet = { label: dLabel, data: [], fill: false, backgroundColor: [], borderColor: [] }

                let r = Math.floor(Math.random() * 255);
                let g = Math.floor(Math.random() * 255);
                let b = Math.floor(Math.random() * 255);
                dSet.backgroundColor.push("rgba(" + r + ", " + g + ", " + b + ",0.2)");
                dSet.borderColor.push("rgb(" + r + ", " + g + ", " + b + ")");

                dataObject.forEach((dataPoint, i) => {
                  //Push each data point corresponding to label into label's dataset
                  dSet.data.push(dataPoint[dLabel]);

                  //Randomise the colours
                });

                //Push the dataset into data array
                datasetsArr.push(dSet);
              }

            })

            console.log("Data compatible with chart js", { labels: xAxisLabels, datasets: datasetsArr });

            return { labels: xAxisLabels, datasets: datasetsArr };

          }


          let ctx = $(`#chart-${uid}`);
          console.log($(`#chart-${uid}`));

          let chart = new Chart(ctx, {
            type: 'line',
            title: {
              text: "Chart " + this.uniqueChartID()
            },
            toolTip: {
              shared: true
            },
            legend: {
              cursor: "pointer",
              verticalAlign: "top",
              horizontalAlign: "center",
              dockInsidePlotArea: true,
              itemclick: toggleDataSeries
            },
            data: getData(),
            options: {
              responsive: true,
              title: "Chart ",
              scales: {
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    //X axis name to be displayed
                    labelString: XAxisName,
                  }
                }]
              }
            }
          });
          chart.render();


          console.log("Data Object", dataObject);
        }
        fileReader.onerror = (error) => {
          console.log(error);
        }



      });
    } catch (err) {
      console.log('Error', err);
    }
  }
  // ......................... ESSENTIALS.............................

  disableTitleEnter() {
    $('#title[contenteditable]').keypress((evt) => {
      const keycode = evt.charCode || evt.keyCode;
      if (keycode === 13) {
        // Enter key's keycode
        return false;
      }
    });
  }

  // Check url validity
  validURL(str) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(str);
  }

  // Save board data
  saveData() {
    const boardTitle = document.getElementById('cb-title').innerHTML.trim();
    const boardlData = document.getElementById('main-box').innerHTML.trim();
    this.apiService.saveBoardData(boardTitle, boardlData);
    // this.apiService.getBoardData();
  }

  //H1 Tag
  addH1TagHTMLCode = (uid) => {
    $(`#cb-buttons-${uid}`).append(`
    <!-- H1 tag -->
    <div class="tool box1 m-1">
      <button class="btn btn-light" id="add-h1-box2-${uid}">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-type-h1" fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.258V8.728h4.62V13h1.259zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z" />
        </svg>
      </button>
    </div>
    `)
  }

  addH1TagClickFunction = (uid) => {
      // Adding H1 Tags
      $(`#add-h1-box2-${uid}`).click(() => {
        $(`#cb-box-2-${uid}`).removeClass('cb-H2 cb-H3').addClass('cb-H1');
      });
  }
}
