#include <string.h>
#include "type.h"

enum Type parse_type(char* type)
{
    if (strcmp(type, get_type_as_string(Number)) == 0)
    {
        return Number;
    } else if (strcmp(type, get_type_as_string(String)) == 0)
    {
        return String;
    } else if (strcmp(type, get_type_as_string(Array)) == 0)
    {
        return Array;
    } else if (strcmp(type, get_type_as_string(Boolean)) == 0)
    {
        return Boolean;
    }

    return Object;
}
