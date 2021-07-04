public with sharing class AudioFileUtilities {
    @AuraEnabled
    public static String getBaseDownloadUrl() {
        String baseUrl = Url.getSalesforceBaseUrl().toExternalForm();
        return baseUrl + '/sfc/servlet.shepherd/document/download/';
    }
}
