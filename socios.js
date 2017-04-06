$(function() {

      $( "#accordion" ).accordion({
            collapsible: true
      });

      $( "#resizable" ).resizable({
            animate: true
      });

      $( "#datepicker" ).datepicker();

      $("#sendPost").click(function() {
            var title = '<h3>' + $( "#title" ).val() + '</h3>';
            var container = $("<div></div>");
            var content = '<p>' + $( "#resizable" ).val() + '</p>';
            var date = '<p class="date">' + 'Date : ' + $("#datepicker").val() + '</p>';

            if (invalidPost()) {
                  return;
            }
            container.append(content);
            container.append(date);

            $("#accordion").append(title);
            $("#accordion").append(container);
            $("#accordion").accordion("refresh");
      });

      $( "#dialog" ).dialog({
      	autoOpen: false,
      	width: 400,
      	buttons: [
      		{
      			text: "Send",
      			click: function() {
                              $("#dialog").append("<p>" + $("#text_to_dialog").val() + "</p>")
                        }
      		},
      		{
      			text: "Close",
      			click: function() {
      				$( this ).dialog( "close" );
                              $("#text_to_dialog").hide();
                        }
      		},
      	],
      });

      // Link to open the dialog
      $( "#dialog-link" ).click(function( event ) {
      	$( "#dialog" ).dialog( "open" );
            $("#text_to_dialog").show();
      	event.preventDefault();
      });

      // Hover states on the static widgets
      $( "#dialog-link, #icons li" ).hover(
      	function() {
      		$( this ).addClass( "ui-state-hover" );
      	},
      	function() {
      		$( this ).removeClass( "ui-state-hover" );
      	}
      );

      $( "#radioset" ).buttonset();
      $("#text_to_dialog").hide();
      $( "#topics" ).hide();
      $( "#chat" ).hide();
      $( "#photos").hide();


      // run the currently selected effect
      function runEffectHide(id) {
            // get effect type from
            var selectedEffect = "drop";

            // Most effect types need no options passed by default
            var options = {};
            // some effects have required parameters
            if ( selectedEffect === "scale" ) {
                  options = { percent: 50 };
            } else if ( selectedEffect === "size" ) {
                  options = { to: { width: 200, height: 60 } };
            }
            // Run the effect
            $( id ).hide(selectedEffect, options, "slow");
      };

      // run the currently selected effect
      function runEffectShow(id) {
            // get effect type from
            var selectedEffect = "drop";

            // Most effect types need no options passed by default
            var options = {};

            // some effects have required parameters
            if ( selectedEffect === "scale" ) {
                  options = { percent: 50 };
            } else if ( selectedEffect === "size" ) {
                  options = { to: { width: 280, height: 185 } };
            }

            // Run the effect
            $( id ).show(selectedEffect, options, "slow");
      };

      $("#section_topics").click(function() {
            runEffectHide("#chat");
            $( "#dialog" ).dialog( "close" );
            runEffectHide("#photos");

            runEffectShow("#accordion");
            runEffectShow("#topics");
      });

      $("#section_chat").click(function() {
            runEffectHide("#photos");
            runEffectHide("#accordion");
            runEffectHide("#topics");
            runEffectShow("#chat");
      });

      $("#section_photos").click(function() {
            runEffectHide("#chat");
            $( "#dialog" ).dialog( "close" );
            runEffectHide("#accordion");
            runEffectHide("#topics");
            runEffectShow("#photos");
      });

      function invalidPost() {
            return $( "#title" ).val() == "" || $( "#resizable" ).val() == "" || $("#datepicker").val() == "";
      }

      // There's the gallery and the trash
      var $gallery = $( "#gallery" ),
      $trash = $( "#trash" );

      // Let the gallery items be draggable
      $( "li", $gallery ).draggable({
            cancel: "a.ui-icon", // clicking an icon won't initiate dragging
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            containment: "document",
            helper: "clone",
            cursor: "move"
      });

      // Let the trash be droppable, accepting the gallery items
      $trash.droppable({
            accept: "#gallery > li",
            classes: {
                  "ui-droppable-active": "ui-state-highlight"
            },
                  drop: function( event, ui ) {
                  deleteImage( ui.draggable );
            }
      });

      // Let the gallery be droppable as well, accepting items from the trash
      $gallery.droppable({
            accept: "#trash li",
            classes: {
                  "ui-droppable-active": "custom-state-active"
            },
                  drop: function( event, ui ) {
                  recycleImage( ui.draggable );
            }
      });

      // Image deletion function
      var recycle_icon = "<a href='link/to/recycle/script/when/we/have/js/off' title='Recycle this image' class='ui-icon ui-icon-refresh'>Recycle image</a>";
      function deleteImage( $item ) {
            $item.fadeOut(function() {
                  var $list = $( "ul", $trash ).length ?
                  $( "ul", $trash ) :
                  $( "<ul class='gallery ui-helper-reset'/>" ).appendTo( $trash );

                  $item.find( "a.ui-icon-trash" ).remove();
                  $item.append( recycle_icon ).appendTo( $list ).fadeIn(function() {
                        $item
                        .animate({ width: "48px" })
                        .find( "img" )
                        .animate({ height: "36px" });
                  });
            });
      }

      // Image recycle function
      var trash_icon = "<a href='link/to/trash/script/when/we/have/js/off' title='Delete this image' class='ui-icon ui-icon-trash'>Delete image</a>";
      function recycleImage( $item ) {
            $item.fadeOut(function() {
                  $item
                        .find( "a.ui-icon-refresh" )
                        .remove()
                        .end()
                        .css( "width", "96px")
                        .append( trash_icon )
                        .find( "img" )
                        .css( "height", "72px" )
                        .end()
                        .appendTo( $gallery )
                        .fadeIn();
            });
      }

      // Image preview function, demonstrating the ui.dialog used as a modal window
      function viewLargerImage( $link ) {
            var src = $link.attr( "href" ),
            title = $link.siblings( "img" ).attr( "alt" ),
            $modal = $( "img[src$='" + src + "']" );

            if ( $modal.length ) {
                  $modal.dialog( "open" );
            } else {
                  var img = $( "<img alt='" + title + "' width='384' height='288' style='display: none; padding: 8px;' />" )
                  .attr( "src", src ).appendTo( "body" );

                  setTimeout(function() {
                        img.dialog({
                              title: title,
                              width: 400,
                              modal: true
                        });
                  }, 1);
            }
      }

      // Resolve the icons behavior with event delegation
      $( "ul.gallery > li" ).on( "click", function( event ) {
            var $item = $( this ),
            $target = $( event.target );

            if ( $target.is( "a.ui-icon-trash" ) ) {
                  deleteImage( $item );
            } else if ( $target.is( "a.ui-icon-zoomin" ) ) {
                  viewLargerImage( $target );
            } else if ( $target.is( "a.ui-icon-refresh" ) ) {
                  recycleImage( $item );
            }
            return false;
      });
});
