/**
 * AGNITIO FRAMEWORK MODULE - Analytics
 * This module will automatically log slide data to the Agnitio Analyzer.
 * It will look for the slide name in two places (not looking further when found):
 * - a global JavaScript object named monitormap,
 * - the actual slide id.
 * @author - Stefan Liden, sli@agnitio.com
 */
 document.addEventListener('presentationInit', function() {

  function sendDefaults (version) {
    // Send some default analytics
    if (app.type === 'json') {
      ag.submit.structure("Default structure", JSON.stringify(app.json.structures));
    }
    if (app.version) {
      ag.submit.data({
        unique: true,
        categoryId: "ag-001",
        category: "Versions",
        labelId: "ag-001-002",
        label: "Framework version",
        value: app.version
      });
    }
    if (version) {
      ag.submit.data({
        unique: true,
        categoryId: "ag-001",
        category: "Versions",
        labelId: "ag-001-003",
        label: "Presentation version",
        value: version
      });
    }
  }

  app.analytics = (function () {

    var map = null,
        version = null,
        excludedContent = [],
        excluded = [],
        offsetChapter = 0;

    /**
     * Initialize analytics
     * @public
     * @param config OBJECT Configure the analytics
     *  -map OBJECT Map to translate ids to custom strings
     *  -offsetChapters INT Number of path items to offset to get chapter
     *  -excludeContent ARRAY List of content that should not be included
     *  -excludeSlides ARRAY List of slides to exclude from analytics
     */
    function init (config) {
      if (window.ag) {
        config = config || {};
        map = config.map || null;
        version = config.version || null;
        offsetChapter = config.offsetChapters || 0;
        excludedContent = config.excludeContent || [];
        excluded = config.excludeSlides || [];
        sendDefaults(version);
        log(excludedContent);
      }
      else {
        throw new Error('The Agnitio Content API is required to collect analytic data');
      }
    }

    /**
     * Save chapter/subchapter/slide to Analyzer
     * @private
     */
    function save () {
      var sPath = app.getPath(),
          path = sPath.split('/'),
          ln = path.length,
          sIndex = app.slideshow.currentIndex + 1,
          offset = offsetChapter,
          lnOffset = ln - offset,
          chapter = subchapter = null,
          mChapterId, mChapterName, mSubchapterId, mSubchapterName, mSlideId, mSlideName,
          slide = path[ln - 1];

      // If slide has been excluded, then skip.
      if (excluded.indexOf(slide) !== -1) {
        return;
      }

      // Full path: chapter/subchapter/slide
      if (lnOffset >= 3) {
        chapter = path[1 + offset];
        // Chapter only: chapter/slide
        if (lnOffset >= 4) {
          subchapter = path[2 + offset];
        }
      }
//      console.log(chapter + ' ' + subchapter + ' ' + slide);

      mChapterId = chapter;
      mChapterName = chapter;
      mSubchapterId = subchapter;
      mSubchapterName = subchapter;
      mSlideId = slide;
      mSlideName = slide;

      // If a map exist, use that to get proper ids and names
      if (map) {
        mChapterId = map[chapter].id || chapter;
        mChapterName = map[chapter].name || chapter;
        mSubchapterId = map[subchapter].id || subchapter;
        mSubchapterName = map[subchapter].name || subchapter;
        mSlideId = map[slide].id || slide;
        mSlideName = map[slide].name || slide;
      }
      // Else use the JSON file for names and ids
      else if (app.type === 'json') {
        if (app.json.structures[chapter]) {
          mChapterName = app.json.structures[chapter].name || chapter;
        }
        if (app.json.structures[subchapter]) {
          mSubchapterName = app.json.structures[subchapter].name || subchapter;
        }
        if (app.json.slides[slide]) {
          mSlideName = app.json.slides[slide].name || slide;
        }
      }
      ag.submit.slide({
        id: mSlideId,
        name: mSlideName,
        chapterId: mChapterId,
        chapter: mChapterName,
        subChapterId: mSubchapterId,
        subChapter: mSubchapterName,
        slideIndex: sIndex,
        path: sPath
      });
	    console.log(mSlideId + ' ' + mSlideName + ' ' + mChapterName);
    }

    /**
     * Call save explicitly, to override or if not using framework
     * @public
     * @param chapter The chapter id
     * @param subchapter The subchapter id
     * @param slide The slide id
     */
    function explicitSave (chapter, subchapter, slide) {
      var path = app.getPath();

      // ag.submit.slide({
      //   id: monitorStr,
      //   name: monitorStr,
      //   subChapterId: subChapterId,
      //   subChapter: subChapterId,
      //   chapterId: chapterId,
      //   chapter: chapterId,
      //   path: slidePath
      // });
    }

    /**
     * Set eventlistener for slideEnter
     * @private
     */
    function log (exclude) {
      // Only log slides for certain content if exclude is given
      if (exclude.length) {
        document.addEventListener('contentLoad' ,function () {
          var loaded = app.loaded.id;
          if (exclude.indexOf(loaded) !== -1) {
            document.removeEventListener('slideEnter', save);
          }
          else {
            document.addEventListener('slideEnter', save);
          }
        });
      }
      // Always log slides
      else {
        document.addEventListener('slideEnter', save);
      }
    }

    // Public API
    return {
      init: init,
      save: explicitSave
    }
  }()); // End app.analytics

 });