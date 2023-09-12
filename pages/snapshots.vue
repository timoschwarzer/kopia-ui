<template>
  <v-container fluid>
    <div v-if="snapshotsPending" class="d-flex justify-center py-10">
      <v-progress-circular indeterminate />
    </div>
    <div v-else>
      <h2 class="text-h5 mb-5">
        Snapshots
        <template v-if="path">
          in <span class="font-weight-bold">{{ path }}</span>
        </template>
        <template v-if="host">
          on <span class="font-weight-bold"><template v-if="user">{{ user }}@</template>{{ host }}</span>
        </template>
      </h2>

      <div class="snapshots">
        <kopia-snapshot-card
          v-for="snapshot in snapshots"
          :key="snapshot.id"
          :snapshot="snapshot"
        />
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
  import {useKopiaFetch} from '~/lib/useKopiaFetch'

  const route = useRoute()

  const host = route.query.host
  const user = route.query.user
  const path = route.query.path

  type KopiaSnapshotsResponse = {
    snapshots: KopiaSnapshot[],
    unfilteredCount: number,
    uniqueCount: number,
  }

  const {data: snapshotsResponse, refresh: refreshSnapshots, pending: snapshotsPending} = await useKopiaFetch<KopiaSnapshotsResponse>("snapshots", {
    query: {
      host, user, path
    },
  })

  const snapshots = computed(() => {
    const snapshots = snapshotsResponse.value?.snapshots ?? []
    snapshots.sort((a: KopiaSnapshot, b: KopiaSnapshot) => {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    })
    return snapshots
  })
</script>

<style lang="scss" scoped>
  .snapshots {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
</style>