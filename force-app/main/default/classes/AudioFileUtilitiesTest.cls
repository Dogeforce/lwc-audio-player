@IsTest
private class AudioFileUtilitiesTest {
    @IsTest
    static void test_getBaseDownloadUrl() {
        Test.startTest();
        String result = AudioFileUtilities.getBaseDownloadUrl();
        Test.stopTest();

        System.assertNotEquals(null, result);
        System.assert(result.contains('salesforce.com'));
    }
}
