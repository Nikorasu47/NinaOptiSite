(function ($) {
  $.fn.mauGallery = function (options) {
    const settings = $.extend({}, $.fn.mauGallery.defaults, options);
    return this.each(function () {
      const $gallery = $(this);
      const $items = $gallery.children(".gallery-item");
      const tagsSet = new Set();

      $.fn.mauGallery.methods.createRowWrapper($gallery);

      if (settings.lightBox) {
        $.fn.mauGallery.methods.createLightBox($gallery, settings.lightboxId, settings.navigation);
      }

      $items.each(function () {
        const $item = $(this);
        const tag = $item.data("gallery-tag");

        $.fn.mauGallery.methods.responsiveImageItem($item);
        $.fn.mauGallery.methods.moveItemInRowWrapper($item);
        $.fn.mauGallery.methods.wrapItemInColumn($item, settings.columns);

        if (settings.showTags && tag !== undefined) {
          tagsSet.add(tag);
        }
      });

      if (settings.showTags) {
        $.fn.mauGallery.methods.showItemTags($gallery, settings.tagsPosition, Array.from(tagsSet));
      }

      $.fn.mauGallery.listeners(settings);
      $gallery.fadeIn(300);
    });
  };

  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };

  $.fn.mauGallery.listeners = function (options) {
    const $gallery = $(".gallery");

    $gallery.on("click", ".gallery-item", function () {
      if (options.lightBox && this.tagName === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      }
    });

    $gallery.on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $gallery.on("click", ".mg-prev", () => $.fn.mauGallery.methods.prevImage(options.lightboxId));
    $gallery.on("click", ".mg-next", () => $.fn.mauGallery.methods.nextImage(options.lightboxId));
  };

  $.fn.mauGallery.methods = {
    createRowWrapper($el) {
      if (!$el.children().first().hasClass("row")) {
        $el.append('<div class="gallery-items-row row"></div>');
      }
    },

    wrapItemInColumn($el, columns) {
      let classes = "item-column mb-4";

      if (typeof columns === "number") {
        classes += ` col-${Math.ceil(12 / columns)}`;
      } else if (typeof columns === "object") {
        const sizes = ["xs", "sm", "md", "lg", "xl"];
        sizes.forEach(size => {
          if (columns[size]) {
            classes += ` col-${size}-${Math.ceil(12 / columns[size])}`;
          }
        });
      } else {
        console.error(`Invalid column type: ${typeof columns}`);
        return;
      }

      $el.wrap(`<div class="${classes}"></div>`);
    },

    moveItemInRowWrapper($el) {
      $(".gallery-items-row").append($el);
    },

    responsiveImageItem($el) {
      if ($el.prop("tagName") === "IMG") {
        $el.addClass("img-fluid");
      }
    },

    openLightBox($el, lightboxId) {
      const $lightbox = $(`#${lightboxId}`);
      $lightbox.find(".lightboxImage").attr("src", $el.attr("src"));
      $lightbox.modal("toggle");
    },

    getImageCollection(activeTag) {
      const $columns = $(".item-column");
      const images = [];

      $columns.each(function () {
        const $img = $(this).find("img.gallery-item").first();
        if (!$img.length) return;

        const tag = $img.data("gallery-tag");
        if (activeTag === "all" || tag === activeTag) {
          images.push($img);
        }
      });

      return images;
    },

    prevImage() {
      const currentSrc = $(".lightboxImage").attr("src");
      const activeTag = $(".tags-bar .active-tag").data("images-toggle");
      const images = $.fn.mauGallery.methods.getImageCollection(activeTag);

      const index = images.findIndex(img => img.attr("src") === currentSrc);
      const prevIndex = (index - 1 + images.length) % images.length;

      $(".lightboxImage").attr("src", images[prevIndex].attr("src"));
    },

    nextImage() {
      const currentSrc = $(".lightboxImage").attr("src");
      const activeTag = $(".tags-bar .active-tag").data("images-toggle");
      const images = $.fn.mauGallery.methods.getImageCollection(activeTag);

      const index = images.findIndex(img => img.attr("src") === currentSrc);
      const nextIndex = (index + 1) % images.length;

      $(".lightboxImage").attr("src", images[nextIndex].attr("src"));
    },

    createLightBox($gallery, lightboxId, navigation) {
      const id = lightboxId || "galleryLightbox";

      const navLeft = navigation
        ? `<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>`
        : "";

      const navRight = navigation
        ? `<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">></div>`
        : "";

      const modal = `
        <div class="modal fade" id="${id}" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-body">
                ${navLeft}
                <img class="lightboxImage img-fluid" alt="" title="" />
                ${navRight}
              </div>
            </div>
          </div>
        </div>`;

      $gallery.append(modal);
    },

    showItemTags($gallery, position, tags) {
      let items = `<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>`;
      tags.forEach(tag => {
        items += `<li class="nav-item"><span class="nav-link" data-images-toggle="${tag}">${tag}</span></li>`;
      });

      const tagBar = `<ul class="my-4 tags-bar nav nav-pills">${items}</ul>`;

      if (position === "top") {
        $gallery.prepend(tagBar);
      } else {
        $gallery.append(tagBar);
      }
    },

    filterByTag() {
      const $clicked = $(this);
      if ($clicked.hasClass("active-tag")) return;

      $(".active.active-tag").removeClass("active active-tag");
      $clicked.addClass("active-tag active");

      const tag = $clicked.data("images-toggle");
      $(".gallery-item").each(function () {
        const $item = $(this);
        const $column = $item.closest(".item-column");

        if (tag === "all" || $item.data("gallery-tag") === tag) {
          $column.show(300);
        } else {
          $column.hide();
        }
      });
    }
  };
})(jQuery);