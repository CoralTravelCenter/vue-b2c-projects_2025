<script setup lang="ts">
import {Toaster} from '@/shared/ui/sonner'
import 'vue-sonner/style.css'
import {Button} from "@/shared/ui/button";
</script>

<template>
	<Toaster/>
	<Button
			variant="outline" @click="() => {
      toast('Event has been created', {
        description: 'Sunday, December 03, 2023 at 9:00 AM',
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      })
    }"
	>
		Add to calendar
	</Button>
</template>
