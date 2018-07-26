using MessageOfTheDaySDK;
using UnityEngine;
using UnityEngine.UI;


public class MessageOfTheDaySDKUIScript : MonoBehaviour
{
    private Text statusText;

    public void Start()
    {
        Globals.DebugFlag = true;

        statusText = GameObject.Find("StatusText").GetComponent<Text>();

        //check here for more information regarding authentication and authorization in Azure App Service
        //https://azure.microsoft.com/en-us/documentation/articles/app-service-authentication-overview/
    }

    public void ClearOutput()
    {
        statusText.text = string.Empty;
    }



    public void GetMessagesOfTheDay()
    {
        MessageOfTheDaySDKClient.Instance.GetMessagesOfTheDay(response =>
        {
            if (response.Status == CallBackResult.Success)
            {
                string result = "Get messages of the day completed";
                if (Globals.DebugFlag)
                    foreach (var item in response.Result)
                    {
                        WriteLine(string.Format("title is {0},message is {1}, from is {2}, to is {3}, showAlways is {4}, priority is {5}",
                            item.title, item.message, item.from, item.to, item.isActive, item.priority));
                    }
                WriteLine(result);
            }
            else
            {
                WriteLine(response.Exception.Message);
            }
        });
        WriteLine("Loading...");
    }




    public void WriteLine(string s)
    {
        if (statusText.text.Length > 20000)
            statusText.text = string.Empty + "-- TEXT OVERFLOW --";

        statusText.text += s + "\r\n";
    }

}




