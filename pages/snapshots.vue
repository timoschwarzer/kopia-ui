<template>
  <v-container fluid>
    <div v-if="snapshotsPending && snapshots.length === 0" class="d-flex justify-center py-10">
      <v-progress-circular indeterminate />
    </div>
    <div v-else>
      <div class="d-flex flex-wrap">
        <h2 class="text-h5 mb-5">
          Snapshots
          <template v-if="path">
            in <span class="font-weight-bold">{{ path }}</span>
          </template>
          <template v-if="host">
            on <span class="font-weight-bold"><template v-if="user">{{ user }}@</template>{{ host }}</span>
          </template>
        </h2>

        <template v-if="isOwnHost">
          <v-spacer />

          <v-btn color="accent" :loading="snapshotRunning || snapshotNowLoading" @click="onSnapshotNowClicked">
            Snapshot now
          </v-btn>
        </template>
      </div>

      <div class="snapshots">
        <kopia-snapshot-card
          v-for="snapshot in snapshots"
          :key="snapshot.id"
          :snapshot="snapshot"
          @click="onSnapshotCardClicked(snapshot)"
        />
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
  import {useKopiaFetch} from '~/lib/useKopiaFetch'
  import {useRepositoryStore} from '~/stores/repositoryStore'

  const route = useRoute()
  const router = useRouter()

  const repositoryStore = useRepositoryStore()

  const host = toRef(route.query.host)
  const user = toRef(route.query.user)
  const path = toRef(route.query.path)

  const snapshotQuery = computed(() => ({
    user: String(user.value),
    host: String(host.value),
    path: String(path.value),
  }))
  const isOwnHost = computed(() => host.value === repositoryStore.status?.hostname)
  const snapshotRunning = computed(() => repositoryStore.sources.some(s => {
    return s.source.host === host.value &&
      s.source.path === path.value &&
      s.source.userName === user.value &&
      s.status === 'UPLOADING'
  }))
  const snapshotNowLoading = ref(false)

  type KopiaSnapshotsResponse = {
    snapshots: KopiaSnapshot[],
    unfilteredCount: number,
    uniqueCount: number,
  }

  const {data: snapshotsResponse, refresh: refreshSnapshots, pending: snapshotsPending} = await useKopiaFetch<KopiaSnapshotsResponse>("snapshots", {
    query: snapshotQuery.value,
  })

  const snapshots = computed(() => {
    const snapshots = snapshotsResponse.value?.snapshots ?? []
    snapshots.sort((a: KopiaSnapshot, b: KopiaSnapshot) => {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    })
    return snapshots
  })

  useTimeoutPoll(async () => {
    await repositoryStore.refreshSources(snapshotQuery.value)
    await refreshSnapshots()
  }, 2000, {immediate: true})

  function onSnapshotCardClicked(snapshot: KopiaSnapshot) {
    router.push({name: 'browse', query: {path: path.value, object: snapshot.rootID, root: snapshot.rootID}})
  }

  async function onSnapshotNowClicked() {
    snapshotNowLoading.value = true

    await useKopiaFetch('sources/upload', {
      method: 'POST',
      query: {
        userName: user.value,
        host: host.value,
        path: path.value,
      }
    })
    await repositoryStore.refreshSources(snapshotQuery.value)

    snapshotNowLoading.value = false
  }
</script>

<style lang="scss" scoped>
  .snapshots {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
</style>