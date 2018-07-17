using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using UnityEngine;
using UnityEngine.Networking;

#if NETFX_CORE
using Windows.Security.Cryptography.Core;
using Windows.Security.Cryptography;
using System.Runtime.InteropServices.WindowsRuntime;
#endif

namespace MessageOfTheDaySDK
{
    public static class Utilities
    {
        public static UnityWebRequest BuildMessageOfTheDayAPIWebRequest(string url, string method, string json)
        {
            UnityWebRequest www = new UnityWebRequest(url, method);

            www.SetRequestHeader(Globals.Accept, Globals.ApplicationJson);
            www.SetRequestHeader(Globals.Content_Type, Globals.ApplicationJson);

            www.downloadHandler = new DownloadHandlerBuffer();

            if (!string.IsNullOrEmpty(json))
            {
                byte[] payload = Encoding.UTF8.GetBytes(json);
                UploadHandler handler = new UploadHandlerRaw(payload);
                handler.contentType = Globals.ApplicationJson;
                www.uploadHandler = handler;
            }
            return www;
        }

        public static void ValidateForNull(params object[] objects)
        {
            foreach (object obj in objects)
            {
                if (obj == null)
                {
                    throw new Exception("Argument null");
                }
            }

        }



        public static bool IsWWWError(UnityWebRequest www)
        {
            return www.isError || (www.responseCode >= 400L && www.responseCode <= 511L);
        }

        public static void BuildResponseObjectOnFailure(CallbackResponse response, UnityWebRequest www)
        {
            if (www.responseCode == 404L)
                response.Status = CallBackResult.NotFound;
            else if (www.responseCode == 409L)
                response.Status = CallBackResult.ResourceExists;
            else
                response.Status = CallBackResult.Failure;

            string errorMessage = www.error;
            if (errorMessage == null && www.downloadHandler != null && !string.IsNullOrEmpty(www.downloadHandler.text))
                errorMessage = www.downloadHandler.text;
            else
                errorMessage = Globals.ErrorOccurred;

            Exception ex = new Exception(errorMessage);
            response.Exception = ex;
        }

        public static void BuildResponseObjectOnException(CallbackResponse response, Exception ex)
        {
            response.Status = CallBackResult.LocalException;
            response.Exception = ex;
        }

    }

  

    public enum HttpMethod
    {
        Post,
        Get,
        Patch,
        Delete,
        Put,
        Merge
    }
}

