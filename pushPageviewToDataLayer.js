function pushPageviewToDataLayer() {
  var section = batTag.SECTION.USUARIO;
  var pageType = batTag.PAGETYPE.REGISTRO;
  var pageTitle = batTag.PAGETITLE.DATOS_PERSONALES;

  batTag.sendPageview(section, pageType, pageTitle);

}
