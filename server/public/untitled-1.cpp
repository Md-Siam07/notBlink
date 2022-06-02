/*   ALLAH is Almighty.....  */

#include <stdio.h>

int main()
{
      FILE *fp = fopen("Error.txt", "r");

      char name[100];
      int roll;

      fscanf(fp, "%s", name);
      printf("Name = %s\n", name);

      fscanf(fp, "%d", &roll);
      printf("Roll = %d\n", roll);

      return 0;
}
