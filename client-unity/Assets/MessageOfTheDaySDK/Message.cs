using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace MessageOfTheDaySDK
{

    [Serializable()]
    public class Message
    {
        public string title;
        public string message;
        public bool alwaysShow;
        public string from;
        public string to;
        public int priority;
    }
}
